import { z } from "zod";

export const paymentStatusSchema = z.enum([
  "PENDING",
  "PROCESSING",
  "SUCCEEDED",
  "FAILED",
  "REFUNDED",
]);

export const paymentSchema = {
  createPaymentIntent: z.object({
    orderId: z.string().uuid(),
    amount: z.coerce.number().min(1),
    currency: z.string().trim().min(2).max(3).default("usd"),
  }),

  webhookPayload: z.object({
    id: z.string(),
    type: z.string(),
    data: z.object({
      object: z.object({
        id: z.string(),
        status: z.string(),
        amount: z.coerce.number().optional(),
        currency: z.string().optional(),
        metadata: z.record(z.string()).optional(),
      }),
    }),
  }),
};

export type CreatePaymentIntent = z.infer<typeof paymentSchema.createPaymentIntent>;
