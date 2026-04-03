import { z } from "zod";

export const addressSchema = {
  createAddress: z.object({
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
    addressLine: z.string().trim().min(1),
    city: z.string().trim().min(1),
    state: z.string().trim().min(1),
    postalCode: z.string().trim().min(1),
    country: z.string().trim().min(1),
    phone: z.string().trim().min(1),
    isDefault: z.boolean().default(false),
  }),

  updateAddress: z.object({
    firstName: z.string().trim().min(1).optional(),
    lastName: z.string().trim().min(1).optional(),
    addressLine: z.string().trim().min(1).optional(),
    city: z.string().trim().min(1).optional(),
    state: z.string().trim().min(1).optional(),
    postalCode: z.string().trim().min(1).optional(),
    country: z.string().trim().min(1).optional(),
    phone: z.string().trim().min(1).optional(),
    isDefault: z.boolean().optional(),
  }),
};

export type CreateAddress = z.infer<typeof addressSchema.createAddress>;
export type UpdateAddress = z.infer<typeof addressSchema.updateAddress>;
