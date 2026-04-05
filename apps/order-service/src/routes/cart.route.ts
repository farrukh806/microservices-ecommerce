import { FastifyPluginAsync } from "fastify";
import { cartController } from "../controllers/cart.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

const cartRoute: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", isAuthenticated);

  fastify.get("/cart", cartController.getCart);
  fastify.post("/cart/items", cartController.addItem);
  fastify.patch("/cart/items", cartController.updateItem);
  fastify.delete("/cart/items", cartController.removeItem);
  fastify.delete("/cart", cartController.clearCart);
};

export default cartRoute;
