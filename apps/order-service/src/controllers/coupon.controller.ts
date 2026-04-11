import { prisma } from "@repo/product-db";
import { couponSchema } from "@repo/shared-schemas";
import type { FastifyRequest, FastifyReply } from "fastify";

export const couponController = {
  async validateCoupon(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.userId!;
    const { code, orderSubtotal } = couponSchema.validate.parse(request.body);

    const coupon = await prisma.coupon.findUnique({ where: { code } });

    if (!coupon || !coupon.isActive) {
      return reply.status(400).send({ valid: false, reason: "Invalid coupon code" });
    }

    const now = new Date();
    if (coupon.expiresAt < now) {
      return reply.status(400).send({ valid: false, reason: "Coupon has expired" });
    }
    if (coupon.startsAt > now) {
      return reply.status(400).send({ valid: false, reason: "Coupon is not yet active" });
    }
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return reply.status(400).send({ valid: false, reason: "Coupon usage limit reached" });
    }

    // Check per-user usage
    const userUsage = await prisma.order.count({
      where: { userId, couponId: coupon.id },
    });
    if (userUsage >= coupon.perUserLimit) {
      return reply.status(400).send({ valid: false, reason: "You've already used this coupon" });
    }

    if (coupon.minOrderAmount && orderSubtotal < coupon.minOrderAmount) {
      return reply.status(400).send({
        valid: false,
        reason: `Minimum order of $${coupon.minOrderAmount} required`,
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = orderSubtotal * (coupon.discountValue / 100);
      if (coupon.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
      }
    } else if (coupon.discountType === "FIXED_AMOUNT") {
      discountAmount = Math.min(coupon.discountValue, orderSubtotal);
    } else if (coupon.discountType === "FREE_SHIPPING") {
      discountAmount = 9.99; // flat shipping cost
    }

    return reply.send({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
      },
    });
  },

  async applyCoupon(request: FastifyRequest, reply: FastifyReply) {
    // This endpoint is informational — actual application happens at order creation
    const { code } = couponSchema.applyToOrder.parse(request.body);

    const coupon = await prisma.coupon.findUnique({ where: { code } });
    if (!coupon) {
      return reply.status(404).send({ message: "Coupon not found" });
    }

    return reply.send({ code: coupon.code, discountType: coupon.discountType });
  },
};