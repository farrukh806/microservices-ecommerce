import { prisma } from "@repo/product-db";
import { wishlistSchema } from "@repo/shared-schemas";
import type { FastifyRequest, FastifyReply } from "fastify";

export const wishlistController = {
  async getWishlist(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.userId!;

    const items = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: { include: { inventory: true, category: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return reply.send({ items });
  },

  async addItem(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.userId!;
    const { productId, size, color } = wishlistSchema.addItem.parse(request.body);

    // Verify product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return reply.status(404).send({ message: "Product not found" });
    }

    const item = await prisma.wishlistItem.upsert({
      where: {
        userId_productId_size_color: {
          userId,
          productId,
          size: size || "",
          color: color || "",
        },
      },
      create: { userId, productId, size: size || null, color: color || null },
      update: {},
    });

    return reply.status(201).send(item);
  },

  async removeItem(
    request: FastifyRequest<{ Params: { productId: string } }>,
    reply: FastifyReply,
  ) {
    const userId = request.userId!;
    const { productId } = request.params;
    const { size, color } = wishlistSchema.removeItem.parse(request.query);

    await prisma.wishlistItem.deleteMany({
      where: {
        userId,
        productId,
        ...(size ? { size } : {}),
        ...(color ? { color } : {}),
      },
    });

    return reply.send({ message: "Item removed from wishlist" });
  },
};