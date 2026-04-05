import { FastifyPluginAsync } from "fastify";
import { orderController } from "../controllers/order.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

const orderRoutes: FastifyPluginAsync = async (fastify) => {
  // All routes require authentication
  fastify.addHook("preHandler", isAuthenticated);

  fastify.post("/order", orderController.createOrder);
  fastify.get("/order", orderController.getOrders);
  fastify.get("/orders", orderController.getOrders); // Alias for /order
  fastify.get("/order/:id", orderController.getOrderById);
  fastify.patch("/order/:id/status", orderController.updateOrderStatus);
};

export default orderRoutes;
