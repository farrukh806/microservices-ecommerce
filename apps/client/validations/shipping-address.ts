import z from "zod";

export const shippingAddressSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  addressLine: z.string().trim().min(1, "Address is required"),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  postalCode: z.string().trim().min(1, "Postal code is required"),
  country: z.string().trim().min(1, "Country is required"),
  phone: z.string().trim().min(1, "Phone is required"),
});

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
