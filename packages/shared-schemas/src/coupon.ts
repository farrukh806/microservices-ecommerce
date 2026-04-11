import { z } from "zod";

export const couponSchema = {
  validate: z.object({
    code: z.string().trim().toUpperCase(),
    orderSubtotal: z.number().min(0),
  }),

  applyToOrder: z.object({
    code: z.string().trim().toUpperCase(),
  }),

  createCoupon: z.object({
    code: z.string().trim().toUpperCase().min(3).max(20),
    description: z.string().max(200).optional(),
    discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT", "FREE_SHIPPING"]),
    discountValue: z.number().positive(),
    minOrderAmount: z.number().min(0).optional(),
    maxDiscountAmount: z.number().positive().optional(),
    applicableProductIds: z.array(z.string().uuid()).optional(),
    applicableCategorySlugs: z.array(z.string()).optional(),
    usageLimit: z.number().int().positive().optional(),
    perUserLimit: z.number().int().positive().default(1),
    startsAt: z.string().datetime().optional(),
    expiresAt: z.string().datetime(),
  }),
};

export type ValidateCoupon = z.infer<typeof couponSchema.validate>;
export type ApplyCoupon = z.infer<typeof couponSchema.applyToOrder>;
export type CreateCoupon = z.infer<typeof couponSchema.createCoupon>;