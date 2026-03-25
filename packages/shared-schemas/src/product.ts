import { z } from "zod";

// id               String   @id @default(uuid())
//   name             String
//   shortDescription String
//   description      String
//   price            Float
//   size             String
//   colors           String
//   images           Json
export const productSchema = {
  createProduct: z.object({
    name: z
      .string({ message: "Name is required" })
      .trim()
      .min(3, { message: "Name must at least 3 characters" }),
    description: z
      .string({ message: "Description is required" })
      .trim()
      .min(3, { message: "Description must at least 3 characters" })
      .max(500, { message: "Description can not exceed 500 characters" }),
    shortDescription: z
      .string({ message: "Short description is required" })
      .trim()
      .min(3, { message: "Short description must at least 3 characters" })
      .max(100, { message: "Short description can not exceed 100 characters" }),
    price: z.coerce
      .number({ message: "Price is required" })
      .min(1, { message: "Price must not be 0" }),
    size: z
      .array(z.string().trim().min(1))
      .min(1, { message: "Size is required" }),
    colors: z
      .array(z.string().trim().min(1))
      .min(1, { message: "Color is required" }),
    images: z.array(z.string().trim().min(1)).default([]),
    categorySlug: z.string({ message: "Category is required" }).trim().min(1),
  }),
};
export type CreateProduct = z.infer<typeof productSchema.createProduct>;
