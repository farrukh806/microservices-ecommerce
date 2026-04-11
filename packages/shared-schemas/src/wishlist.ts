import { z } from "zod";

export const wishlistSchema = {
  addItem: z.object({
    productId: z.string().uuid(),
    size: z.string().optional(),
    color: z.string().optional(),
  }),

  removeItem: z.object({
    productId: z.string().uuid(),
    size: z.string().optional(),
    color: z.string().optional(),
  }),
};

export type AddWishlistItem = z.infer<typeof wishlistSchema.addItem>;
export type RemoveWishlistItem = z.infer<typeof wishlistSchema.removeItem>;