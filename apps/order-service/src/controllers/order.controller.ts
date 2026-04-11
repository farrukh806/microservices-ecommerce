import { prisma } from "@repo/product-db";
import { orderSchema } from "@repo/shared-schemas";
import type { FastifyRequest, FastifyReply } from "fastify";

export const orderController = {
  async createOrder(request: FastifyRequest, reply: FastifyReply) {
    console.log("Creating order with body:", request.body);
    const userId = request.userId!;
    const { shippingAddress, paymentMethod } = orderSchema.createOrder.parse(
      request.body,
    );
    const couponCode = request.headers["x-coupon-code"] as string | undefined;

    // Get user's cart with items
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    console.log("cart", cart);
    if (!cart || cart.items.length === 0) {
      return reply.status(400).send({ message: "Cart is empty" });
    }

    // Get product prices from DB (and inventory)
    const productIds = cart.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true, name: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Verify all products exist and check stock
    for (const item of cart.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return reply.status(400).send({
          message: `Product ${item.productId} not found`,
        });
      }

      // Check available inventory
      const inventory = await prisma.productInventory.findUnique({
        where: { productId: item.productId },
      });
      const availableQty = (inventory?.quantity ?? 0) - (inventory?.reservedQty ?? 0);
      if (availableQty < item.quantity) {
        return reply.status(400).send({
          message: `Insufficient stock for product: ${product.name}`,
        });
      }
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => {
      const product = productMap.get(item.productId)!;
      return sum + product.price * item.quantity;
    }, 0);

    // Handle coupon discount
    let discountAmount = 0;
    let discountReason: string | undefined;
    let couponId: string | undefined;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode },
      });

      if (coupon && coupon.isActive && coupon.expiresAt > new Date() && coupon.startsAt <= new Date()) {
        // Check usage limits
        if (!coupon.usageLimit || coupon.usageCount < coupon.usageLimit) {
          const userUsage = await prisma.order.count({ where: { userId, couponId: coupon.id } });
          if (userUsage < coupon.perUserLimit) {
            if (!coupon.minOrderAmount || subtotal >= coupon.minOrderAmount) {
              couponId = coupon.id;

              if (coupon.discountType === "PERCENTAGE") {
                discountAmount = subtotal * (coupon.discountValue / 100);
                if (coupon.maxDiscountAmount) {
                  discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
                }
                discountReason = `${coupon.code} applied (${coupon.discountValue}% off)`;
              } else if (coupon.discountType === "FIXED_AMOUNT") {
                discountAmount = Math.min(coupon.discountValue, subtotal);
                discountReason = `${coupon.code} applied ($${coupon.discountValue} off)`;
              } else if (coupon.discountType === "FREE_SHIPPING") {
                discountAmount = 9.99;
                discountReason = `${coupon.code} applied (free shipping)`;
              }
            }
          }
        }
      }
    }

    const taxableAmount = subtotal - discountAmount;
    const shippingCost = subtotal > 100 - discountAmount || discountReason?.includes("free shipping") ? 0 : 9.99;
    const tax = taxableAmount * 0.08;
    const total = taxableAmount + shippingCost + tax;

    // Create order with items in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Reserve inventory for each item
      for (const item of cart.items) {
        await tx.productInventory.update({
          where: { productId: item.productId },
          data: { reservedQty: { increment: item.quantity } },
        });
      }

      const created = await tx.order.create({
        data: {
          userId,
          status: "PENDING",
          shippingAddress: shippingAddress as any,
          subtotal,
          shippingCost,
          tax,
          total,
          discountAmount,
          discountReason,
          couponId,
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

      // Update coupon usage count if applied
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usageCount: { increment: 1 } },
        });
      }

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
        include: { items: true, coupon: true },
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
      include: { items: true, payment: true, coupon: true },
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

    const order = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id },
        data: { status },
        include: { items: true },
      });

      // If cancelled, release reserved inventory
      if (status === "CANCELLED") {
        for (const item of order.items) {
          await tx.productInventory.update({
            where: { productId: item.productId },
            data: { reservedQty: { decrement: item.quantity } },
          });
        }
      }

      return updated;
    });

    return reply.send(order);
  },
};