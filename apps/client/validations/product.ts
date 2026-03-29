import { z } from "zod";

export const productFormValidationSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(parseFloat(val)), "Price must be a valid number"),
  sizes: z.array(z.string()).min(1, "Select at least one size"),
  colorsText: z.string().min(1, "Colors are required"),
  categorySlug: z.string().min(1, "Category is required"),
});

export type ProductFormValues = z.infer<typeof productFormValidationSchema>;
