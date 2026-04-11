import { z } from "zod";

export const reviewSchema = {
  createReview: z.object({
    productId: z.string().uuid(),
    rating: z.number().int().min(1).max(5),
    title: z.string().max(100).optional(),
    content: z.string().max(2000).optional(),
    photos: z.array(z.string().url()).max(5).optional(),
  }),

  voteReview: z.object({
    helpful: z.boolean(),
  }),

  getReviewsQuery: z.object({
    productId: z.string().uuid(),
    page: z.preprocess(
      (v) => (Array.isArray(v) ? v[0] : v),
      z.coerce.number().int().min(1).default(1),
    ),
    size: z.preprocess(
      (v) => (Array.isArray(v) ? v[0] : v),
      z.coerce.number().int().min(1).max(50).default(10),
    ),
    sortBy: z.preprocess(
      (v) => (Array.isArray(v) ? v[0] : v),
      z.enum(["newest", "highest", "lowest", "helpful"]).default("newest"),
    ),
  }),
};

export type CreateReview = z.infer<typeof reviewSchema.createReview>;
export type VoteReview = z.infer<typeof reviewSchema.voteReview>;
export type GetReviewsQuery = z.infer<typeof reviewSchema.getReviewsQuery>;