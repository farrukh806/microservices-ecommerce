import { z } from "zod";

export const notificationSchema = {
  markAsRead: z.object({
    ids: z.array(z.string().uuid()),
  }),

  subscribeBackInStock: z.object({
    productId: z.string().uuid(),
    email: z.string().email().optional(),
  }),
};

export type MarkAsRead = z.infer<typeof notificationSchema.markAsRead>;
export type SubscribeBackInStock = z.infer<typeof notificationSchema.subscribeBackInStock>;