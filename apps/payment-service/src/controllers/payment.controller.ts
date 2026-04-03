import { prisma } from "@repo/product-db";
import { paymentSchema } from "@repo/shared-schemas";
import { Context } from "hono";

export const paymentController = {
  async createPaymentIntent(c: Context) {
    const userId = c.get("userId");
    const { orderId, amount, currency } = paymentSchema.createPaymentIntent.parse(
      await c.req.json(),
    );

    // Verify the order belongs to this user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      return c.json({ message: "Order not found" }, 404);
    }

    if (order.userId !== userId) {
      return c.json({ message: "Forbidden" }, 403);
    }

    if (order.payment?.status === "SUCCEEDED") {
      return c.json({ message: "Order already paid" }, 400);
    }

    // In production: create Stripe payment intent here
    // For now, simulate a successful payment
    const payment = await prisma.payment.update({
      where: { orderId },
      data: {
        status: "SUCCEEDED",
        providerPaymentId: `pi_mock_${Date.now()}`,
      },
    });

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CONFIRMED" },
    });

    return c.json({ payment, clientSecret: `pi_mock_${Date.now()}_secret` });
  },

  async getPayment(c: Context) {
    const userId = c.get("userId");
    const { orderId } = c.req.param();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      return c.json({ message: "Order not found" }, 404);
    }

    if (order.userId !== userId) {
      return c.json({ message: "Forbidden" }, 403);
    }

    return c.json(order.payment);
  },

  async webhook(c: Context) {
    const payload = await c.req.json();
    const parsed = paymentSchema.webhookPayload.safeParse(payload);

    if (!parsed.success) {
      return c.json({ message: "Invalid payload" }, 400);
    }

    const { type, data } = parsed.data;
    const paymentIntent = data.object;

    if (type === "payment_intent.succeeded") {
      const orderId = paymentIntent.metadata?.orderId;
      if (orderId) {
        await prisma.payment.update({
          where: { orderId },
          data: { status: "SUCCEEDED" },
        });
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "CONFIRMED" },
        });
      }
    }

    return c.json({ received: true });
  },
};
