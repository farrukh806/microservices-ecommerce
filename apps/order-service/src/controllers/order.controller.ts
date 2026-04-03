import { prisma } from "@repo/product-db";
import { orderSchema } from "@repo/shared-schemas";
import type { FastifyRequest, FastifyReply } from "fastify";

export const orderController = {
  async createOrder(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.userId!;
    const { shippingAddress, paymentMethod } = orderSchema.createOrder.parse(
      request.body,
    );

    // Get user's cart with items
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      return reply.status(400).send({ message: "Cart is empty" });
    }

    // Get product prices from DB
    const productIds = cart.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true, name: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Verify all products exist
    for (const item of cart.items) {
      if (!productMap.has(item.productId)) {
        return reply.status(400).send({
          message: `Product ${item.productId} not found`,
        });
      }
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => {
      const product = productMap.get(item.productId)!;
      return sum + product.price * item.quantity;
    }, 0);

    const shippingCost = subtotal > 100 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shippingCost + tax;

    // Create order with items in transaction
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId,
          status: "PENDING",
          shippingAddress: shippingAddress as any,
          subtotal,
          shippingCost,
          tax,
          total,
          items: {
            create: cart.items.map((item) => {
              const product = productMap.get(item.productId)!;
              return {
                productId: item.productId,
                name: product.name,
                size: item.size,
                color: item.color,
                quantity: item.quantity,
                price: product.price,
              };
            }),
          },
          payment: {
            create: {
              amount: total,
              currency: "usd",
              status: "PENDING",
              provider: paymentMethod,
            },
          },
        },
        include: { items: true, payment: true },
      });

      // Clear the cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return created;
    });

    return reply.status(201).send(order);
  },

  async getOrders(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.userId!;
    const query = orderSchema.getOrdersQuery.parse(request.query);

    const [total, orders] = await Promise.all([
      prisma.order.count({ where: { userId } }),
      prisma.order.findMany({
        where: { userId },
        skip: (query.page - 1) * query.size,
        take: query.size,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
    ]);

    return reply.send({
      items: orders,
      page: query.page,
      pageSize: query.size,
      total,
      totalPages: Math.ceil(total / query.size),
    });
  },

  async getOrderById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const userId = request.userId!;
    const { id } = request.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true, payment: true },
    });

    if (!order) {
      return reply.status(404).send({ message: "Order not found" });
    }

    // Ensure user owns this order
    if (order.userId !== userId) {
      return reply.status(403).send({ message: "Forbidden" });
    }

    return reply.send(order);
  },

  async updateOrderStatus(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    const { status } = orderSchema.updateOrderStatus.parse(request.body);

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });

    return reply.send(order);
  },
};
