import { z } from "zod";

export const orderStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);

export const orderSchema = {
  createOrder: z.object({
    shippingAddress: z.object({
      firstName: z.string().trim().min(1),
      lastName: z.string().trim().min(1),
      addressLine: z.string().trim().min(1),
      city: z.string().trim().min(1),
      state: z.string().trim().min(1),
      postalCode: z.string().trim().min(1),
      country: z.string().trim().min(1),
      phone: z.string().trim().min(1),
    }),
    paymentMethod: z.enum(["stripe", "paypal"]).default("stripe"),
  }),

  updateOrderStatus: z.object({
    status: orderStatusSchema,
  }),

  getOrdersQuery: z.object({
    page: z.preprocess(
      (v) => (Array.isArray(v) ? v[0] : v),
      z.coerce.number().int().min(1).default(1),
    ),
    size: z.preprocess(
      (v) => (Array.isArray(v) ? v[0] : v),
      z.coerce.number().int().min(1).max(100).default(20),
    ),
    status: z.preprocess(
      (v) => (Array.isArray(v) ? v[0] : v),
      orderStatusSchema.optional(),
    ),
  }),
};

export type CreateOrder = z.infer<typeof orderSchema.createOrder>;
export type UpdateOrderStatus = z.infer<typeof orderSchema.updateOrderStatus>;
export type GetOrdersQuery = z.infer<typeof orderSchema.getOrdersQuery>;
