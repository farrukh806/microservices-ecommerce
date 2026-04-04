import { z } from "zod";

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
    sizes: z
      .array(z.string().trim().min(1))
      .min(1, { message: "Size is required" }),
    colors: z
      .array(z.string().trim().min(1))
      .min(1, { message: "Color is required" }),
    // Map each color to its image URL.
    images: z.record(z.string().trim().url({ message: "Image value must be a valid URL" })),
    categorySlug: z.string({ message: "Category is required" }).trim().min(1),
  }).superRefine((val, ctx) => {
    const colorSet = new Set(val.colors);

    // Ensure we have an image for every provided color.
    for (const color of val.colors) {
      if (!Object.prototype.hasOwnProperty.call(val.images, color)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["images", color],
          message: `Missing image for color '${color}'`,
        });
      }
    }

    // (Optional) Ensure there are no extra image keys not present in colors.
    for (const key of Object.keys(val.images)) {
      if (!colorSet.has(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["images"],
          message: `Image key '${key}' does not exist in colors`,
        });
      }
    }
  }),
  updateProduct: z.object({
    name: z
      .string({ message: "Name is required" })
      .trim()
      .min(3, { message: "Name must at least 3 characters" })
      .optional(),
    description: z
      .string({ message: "Description is required" })
      .trim()
      .min(3, { message: "Description must at least 3 characters" })
      .max(500, { message: "Description can not exceed 500 characters" })
      .optional(),
    shortDescription: z
      .string({ message: "Short description is required" })
      .trim()
      .min(3, { message: "Short description must at least 3 characters" })
      .max(100, { message: "Short description can not exceed 100 characters" })
      .optional(),
    price: z.coerce
      .number({ message: "Price is required" })
      .min(1, { message: "Price must not be 0" })
      .optional(),
    sizes: z
      .array(z.string().trim().min(1))
      .min(1, { message: "Size is required" })
      .optional(),
    colors: z
      .array(z.string().trim().min(1))
      .min(1, { message: "Color is required" })
      .optional(),
    images: z.record(z.string().trim().url({ message: "Image value must be a valid URL" })).optional(),
    categorySlug: z.string({ message: "Category is required" }).trim().min(1).optional(),
  }).refine((val) => {
    // Must have at least one field to update
    return Object.keys(val).length > 0;
  }, { message: "At least one field must be provided" }),
  getProductsQuery: z.object({
    page: z.preprocess(
      (v) => (Array.isArray(v) ? v[0] : v),
      z.coerce
        .number()
        .int({ message: "Page must be an integer" })
        .min(1, { message: "Page must be >= 1" })
        .default(1),
    ),
    size: z.preprocess(
      (v) => (Array.isArray(v) ? v[0] : v),
      z.coerce
        .number()
        .int({ message: "Size must be an integer" })
        .min(1, { message: "Size must be >= 1" })
        .max(100, { message: "Size must be <= 100" })
        .default(20),
    ),
    category: z.preprocess(
      (v) => (Array.isArray(v) ? v[0] : v),
      z.string().trim().min(1).optional(),
    ),
    // Case-insensitive partial match.
    name: z.preprocess(
      (v) => (Array.isArray(v) ? v[0] : v),
      z.string().trim().min(1).optional(),
    ),
    minPrice: z.preprocess(
      (v) => (Array.isArray(v) ? v[0] : v),
      z.coerce
        .number({ message: "minPrice must be a number" })
        .min(0, { message: "minPrice must be >= 0" })
        .optional(),
    ),
    maxPrice: z.preprocess(
      (v) => (Array.isArray(v) ? v[0] : v),
      z.coerce
        .number({ message: "maxPrice must be a number" })
        .min(0, { message: "maxPrice must be >= 0" })
        .optional(),
    ),
    sortBy: z.preprocess(
      (v) => {
        const raw = Array.isArray(v) ? v[0] : v;
        if (typeof raw !== "string") return raw;

        const lower = raw.trim().toLowerCase();
        if (lower === "createdat") return "createdAt";
        if (lower === "price") return "price";
        if (lower === "name") return "name";
        return raw;
      },
      z.enum(["createdAt", "price", "name"]).default("createdAt"),
    ),
    sortOrder: z.preprocess(
      (v) => {
        const raw = Array.isArray(v) ? v[0] : v;
        if (typeof raw !== "string") return raw;
        return raw.trim().toLowerCase();
      },
      z.enum(["asc", "desc"]).default("desc"),
    ),
  }).superRefine((val, ctx) => {
    if (
      val.minPrice != null &&
      val.maxPrice != null &&
      val.minPrice > val.maxPrice
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["maxPrice"],
        message: "maxPrice must be >= minPrice",
      });
    }
  }),
};
export type CreateProduct = z.infer<typeof productSchema.createProduct>;
