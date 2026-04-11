import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { Resend } from "resend";
import { prisma } from "@repo/product-db";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config({path: path.resolve(__dirname, "../../.env")});

const app = new Hono();
const PORT = 8003;

const resend = new Resend(process.env.RESEND_API_KEY);

app.use("*", cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  allowHeaders: ["Content-Type"],
  allowMethods: ["POST", "GET", "OPTIONS"],
}));

// Order confirmation email
app.post("/send/order-confirmation", async (c) => {
  const { orderId, email, userName } = await c.req.json();

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, user: true },
    });

    if (!order) {
      return c.json({ message: "Order not found" }, 404);
    }

    const itemsList = order.items
      .map((item) => `${item.name} (${item.size}/${item.color}) x${item.quantity} - $${item.price * item.quantity}`)
      .join("\n");

    const { data, error } = await resend.emails.send({
      from: "E-Commerce <noreply@yourdomain.com>",
      to: email,
      subject: `Order Confirmation - #${order.id.slice(0, 8)}`,
      text: `Thank you ${userName || "for your order"}!\n\nYour order #${order.id.slice(0, 8)} is confirmed.\n\nItems:\n${itemsList}\n\nSubtotal: $${order.subtotal.toFixed(2)}\nShipping: $${order.shippingCost.toFixed(2)}\nTax: $${order.tax.toFixed(2)}\nTotal: $${order.total.toFixed(2)}\n\nWe'll notify you when your order ships.`,
    });

    if (error) {
      console.error("Email send error:", error);
      return c.json({ message: "Failed to send email" }, 500);
    }

    // Create notification record
    await prisma.notification.create({
      data: {
        userId: order.userId,
        type: "ORDER_CONFIRMATION",
        title: "Order Confirmed",
        message: `Your order #${order.id.slice(0, 8)} has been confirmed`,
        data: { orderId },
        sentEmail: true,
        emailSentAt: new Date(),
      },
    });

    return c.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Order confirmation email error:", err);
    return c.json({ message: "Internal server error" }, 500);
  }
});

// Order shipped email
app.post("/send/order-shipped", async (c) => {
  const { orderId, email, trackingNumber, carrier } = await c.req.json();

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      return c.json({ message: "Order not found" }, 404);
    }

    await resend.emails.send({
      from: "E-Commerce <noreply@yourdomain.com>",
      to: email,
      subject: `Your Order is Shipped! - #${order.id.slice(0, 8)}`,
      text: `Great news! Your order #${order.id.slice(0, 8)} has been shipped.\n\nTracking: ${trackingNumber}\nCarrier: ${carrier}\n\nYou can track your package using the tracking number above.`,
    });

    await prisma.notification.create({
      data: {
        userId: order.userId,
        type: "ORDER_SHIPPED",
        title: "Order Shipped",
        message: `Your order #${order.id.slice(0, 8)} has been shipped`,
        data: { orderId, trackingNumber, carrier },
        sentEmail: true,
        emailSentAt: new Date(),
      },
    });

    return c.json({ success: true });
  } catch (err) {
    console.error("Order shipped email error:", err);
    return c.json({ message: "Internal server error" }, 500);
  }
});

// Price drop alert
app.post("/send/price-drop", async (c) => {
  const { productId } = await c.req.json();

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true },
    });

    if (!product) {
      return c.json({ message: "Product not found" }, 404);
    }

    // Get all users who have this product in their wishlist
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { productId },
      include: { user: true },
    });

    const emailPromises = wishlistItems.map((item) =>
      resend.emails.send({
        from: "E-Commerce <noreply@yourdomain.com>",
        to: item.user.email,
        subject: `Price Drop: ${product.name}`,
        text: `Good news! ${product.name} is now priced lower.\n\nPrevious price: $${product.price}\n\nDon't miss out - shop now!`,
      }),
    );

    await Promise.all(emailPromises);

    return c.json({ success: true, sent: wishlistItems.length });
  } catch (err) {
    console.error("Price drop email error:", err);
    return c.json({ message: "Internal server error" }, 500);
  }
});

// Back in stock alert
app.post("/send/back-in-stock", async (c) => {
  const { productId } = await c.req.json();

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return c.json({ message: "Product not found" }, 404);
    }

    // Get subscribers
    const subscribers = await prisma.backInStockSubscription.findMany({
      where: { productId, isActive: true },
      include: { user: true },
    });

    const emailPromises = subscribers.map((sub) =>
      resend.emails.send({
        from: "E-Commerce <noreply@yourdomain.com>",
        to: sub.email || sub.user.email,
        subject: `${product.name} is Back in Stock!`,
        text: `Great news! ${product.name} is available again.\n\nShop now before it sells out!`,
      }),
    );

    await Promise.all(emailPromises);

    // Mark subscribers as notified
    await prisma.backInStockSubscription.updateMany({
      where: { productId, isActive: true },
      data: { notifiedAt: new Date() },
    });

    return c.json({ success: true, sent: subscribers.length });
  } catch (err) {
    console.error("Back in stock email error:", err);
    return c.json({ message: "Internal server error" }, 500);
  }
});

// Back in stock subscription
app.post("/back-in-stock/subscribe", async (c) => {
  const { productId, email, userId } = await c.req.json();

  if (!productId) {
    return c.json({ message: "productId is required" }, 400);
  }

  // Use provided email, user email, or generate placeholder
  const subscriberEmail = email || (userId ? (await prisma.user.findUnique({ where: { id: userId } }))?.email : null);

  if (!subscriberEmail) {
    return c.json({ message: "Email is required" }, 400);
  }

  await prisma.backInStockSubscription.upsert({
    where: {
      userId_productId: {
        userId: userId || "anonymous",
        productId,
      },
    },
    create: {
      userId: userId || "anonymous",
      productId,
      email: subscriberEmail,
    },
    update: {
      email: subscriberEmail,
      isActive: true,
    },
  });

  return c.json({ success: true });
});

// Health check
app.get("/", (c) => c.text("Email service running"));

serve(
  {
    fetch: app.fetch,
    port: PORT,
  },
  (info) => {
    console.log(`Email service is running on port ${info.port}`);
  },
);