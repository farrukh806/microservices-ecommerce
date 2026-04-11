import { prisma } from "@repo/product-db";
import { reviewSchema } from "@repo/shared-schemas";
import type { FastifyRequest, FastifyReply } from "fastify";

export const reviewController = {
  async getReviews(request: FastifyRequest, reply: FastifyReply) {
    const { productId, page, size, sortBy } = reviewSchema.getReviewsQuery.parse(request.query);

    const orderBy =
      sortBy === "highest"
        ? { rating: "desc" as const }
        : sortBy === "lowest"
        ? { rating: "asc" as const }
        : sortBy === "helpful"
        ? { helpfulVotes: "desc" as const }
        : { createdAt: "desc" as const };

    const [total, reviews] = await Promise.all([
      prisma.review.count({ where: { productId } }),
      prisma.review.findMany({
        where: { productId },
        skip: (page - 1) * size,
        take: size,
        orderBy,
        include: { user: { select: { firstName: true, lastName: true } } },
      }),
    ]);

    return reply.send({
      items: reviews,
      page,
      pageSize: size,
      total,
      totalPages: Math.ceil(total / size),
    });
  },

  async createReview(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.userId!;
    const data = reviewSchema.createReview.parse(request.body);

    // Check if user has a completed order with this product (verified purchase)
    const verifiedOrder = await prisma.order.findFirst({
      where: {
        userId,
        items: { some: { productId: data.productId } },
        status: { in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] },
      },
    });

    // Create review and update product rating in transaction
    const review = await prisma.$transaction(async (tx) => {
      const created = await tx.review.create({
        data: {
          productId: data.productId,
          userId,
          orderId: verifiedOrder?.id,
          rating: data.rating,
          title: data.title,
          content: data.content,
          photos: data.photos || [],
        },
        include: { user: { select: { firstName: true, lastName: true } } },
      });

      // Update product rating aggregates
      const stats = await tx.review.aggregate({
        where: { productId: data.productId },
        _avg: { rating: true },
        _count: { id: true },
      });

      await tx.product.update({
        where: { id: data.productId },
        data: {
          rating: stats._avg.rating ?? 0,
          reviewCount: stats._count.id,
        },
      });

      return created;
    });

    return reply.status(201).send(review);
  },

  async voteReview(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const { helpful } = reviewSchema.voteReview.parse(request.body);

    if (!helpful) {
      return reply.status(400).send({ message: "Only upvote is supported" });
    }

    const review = await prisma.review.update({
      where: { id },
      data: { helpfulVotes: { increment: 1 } },
    });

    return reply.send(review);
  },
};