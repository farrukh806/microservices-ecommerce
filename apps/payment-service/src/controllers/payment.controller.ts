import { prisma } from "@repo/product-db";
import { paymentSchema } from "@repo/shared-schemas";
import { stripe } from "../config/stripe.config.js";
import type Stripe from "stripe";
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
      include: { payment: true, items: { include: { product: true } } },
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

    // Use order total if amount is 0 or not provided
    const paymentAmount = amount > 0 ? amount : order.total;

    try {
      // Create Stripe PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(paymentAmount * 100), // Convert to cents
        currency: currency,
        metadata: {
          orderId: orderId,
          userId: userId,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Update payment record with Stripe payment intent ID
      const payment = await prisma.payment.update({
        where: { orderId },
        data: {
          status: "PROCESSING",
          providerPaymentId: paymentIntent.id,
        },
      });

      return c.json({
        payment,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error("Failed to create payment intent:", error);
      return c.json({ message: "Failed to create payment intent" }, 500);
    }
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
    const signature = c.req.header("stripe-signature");
    const payload = await c.req.text();

    if (!signature) {
      return c.json({ message: "Missing stripe-signature header" }, 400);
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || "",
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return c.json({ message: "Webhook signature verification failed" }, 400);
    }

    try {
      switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
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
        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.orderId;
        if (orderId) {
          await prisma.payment.update({
            where: { orderId },
            data: { status: "FAILED" },
          });
        }
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = charge.payment_intent as string;
        if (paymentIntentId) {
          const payment = await prisma.payment.findFirst({
            where: { providerPaymentId: paymentIntentId },
          });
          if (payment) {
            await prisma.payment.update({
              where: { id: payment.id },
              data: { status: "REFUNDED" },
            });
          }
        }
        break;
      }
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
      return c.json({ message: "Error processing webhook" }, 500);
    }

    return c.json({ received: true });
  },
};
