import { FastifyPluginAsync } from "fastify";
import { orderController } from "../controllers/order.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

const orderRoutes: FastifyPluginAsync = async (fastify) => {
  // All routes require authentication
  fastify.addHook("preHandler", isAuthenticated);

  fastify.post("/orders", orderController.createOrder);
  fastify.get("/orders", orderController.getOrders);
  fastify.get("/orders/:id", orderController.getOrderById);
  fastify.patch("/orders/:id/status", orderController.updateOrderStatus);
};

export default orderRoutes;
