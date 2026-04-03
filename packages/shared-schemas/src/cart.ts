import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string().uuid(),
  size: z.string().trim().min(1),
  color: z.string().trim().min(1),
  quantity: z.coerce.number().int().min(1).default(1),
});

export const cartSchema = {
  addItem: cartItemSchema,

  updateItem: z.object({
    productId: z.string().uuid(),
    size: z.string().trim().min(1),
    color: z.string().trim().min(1),
    quantity: z.coerce.number().int().min(1),
  }),

  removeItem: z.object({
    productId: z.string().uuid(),
    size: z.string().trim().min(1),
    color: z.string().trim().min(1),
  }),
};

export type AddCartItem = z.infer<typeof cartSchema.addItem>;
export type UpdateCartItem = z.infer<typeof cartSchema.updateItem>;
export type RemoveCartItem = z.infer<typeof cartSchema.removeItem>;
