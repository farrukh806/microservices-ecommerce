import z from "zod";

export const shippingAddressSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(1, { error: "Name must contain at least 1 character" }),

  email: z
    .email({ error: "Invalid email address", })
    .trim()
    .min(1, { error: "Email is required" }),
  phone: z.number({ error: "Only numerical values are allowed" }).min(7),
  address: z
    .string({ error: "Address is required" })
    .trim()
    .min(1, { error: "Address must contain at least 1 character" }),
  city: z
    .string({ error: "City is required" })
    .trim()
    .min(1, { error: "City must contain at least 1 character" }),
});

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
