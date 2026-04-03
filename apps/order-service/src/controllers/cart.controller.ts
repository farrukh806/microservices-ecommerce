import { prisma } from "@repo/product-db";
import { cartSchema } from "@repo/shared-schemas";
import type { FastifyRequest, FastifyReply } from "fastify";

export const cartController = {
  async getCart(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.userId!;

    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            // Join with product to get current price and name
          },
        },
      },
    });

    // Create cart if doesn't exist
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: true },
      });
    }

    // Get product details for items
    const productIds = cart.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, images: true, price: true },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    const itemsWithProducts = cart.items.map((item) => ({
      ...item,
      product: productMap.get(item.productId),
    }));

    return reply.send({ ...cart, items: itemsWithProducts });
  },

  async addItem(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.userId!;
    const { productId, size, color, quantity } = cartSchema.addItem.parse(
      request.body,
    );

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return reply.status(404).send({ message: "Product not found" });
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    // Check if item already exists
    const existing = await prisma.cartItem.findUnique({
      where: {
        cartId_productId_size_color: {
          cartId: cart.id,
          productId,
          size,
          color,
        },
      },
    });

    if (existing) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      // Create new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          size,
          color,
          quantity,
          price: product.price,
        },
      });
    }

    return reply.status(201).send({ message: "Item added to cart" });
  },

  async updateItem(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.userId!;
    const { productId, size, color, quantity } = cartSchema.updateItem.parse(
      request.body,
    );

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      return reply.status(404).send({ message: "Cart not found" });
    }

    const item = await prisma.cartItem.findUnique({
      where: {
        cartId_productId_size_color: {
          cartId: cart.id,
          productId,
          size,
          color,
        },
      },
    });

    if (!item) {
      return reply.status(404).send({ message: "Cart item not found" });
    }

    await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity },
    });

    return reply.send({ message: "Cart item updated" });
  },

  async removeItem(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.userId!;
    const { productId, size, color } = cartSchema.removeItem.parse(
      request.body,
    );

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      return reply.status(404).send({ message: "Cart not found" });
    }

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId,
        size,
        color,
      },
    });

    return reply.send({ message: "Item removed from cart" });
  },

  async clearCart(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.userId!;

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      return reply.status(404).send({ message: "Cart not found" });
    }

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return reply.send({ message: "Cart cleared" });
  },
};
