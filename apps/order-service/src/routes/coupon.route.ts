import { FastifyPluginAsync } from "fastify";
import { couponController } from "../controllers/coupon.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

const couponRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", isAuthenticated);

  fastify.post("/orders/validate-coupon", couponController.validateCoupon);
  fastify.post("/orders/apply-coupon", couponController.applyCoupon);
};

export default couponRoutes;