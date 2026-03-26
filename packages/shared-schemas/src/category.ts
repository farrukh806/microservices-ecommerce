import { z } from "zod";

export const categorySchema = {
  createCategory: z.object({
    name: z.string({ message: "Name is required" }).trim().min(2).max(100),
    slug: z.string({ message: "Slug is required" }).trim().min(1).max(120),
  }),
};

export type CreateCategory = z.infer<typeof categorySchema.createCategory>;
