import { z } from "zod";

export const categoryFormValidationSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required"),
});

export type CategoryFormValues = z.infer<typeof categoryFormValidationSchema>;
