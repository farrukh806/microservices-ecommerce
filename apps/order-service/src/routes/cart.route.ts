import { FastifyPluginAsync } from "fastify";
import { cartController } from "../controllers/cart.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

const cartRoute: FastifyPluginAsync = async (fastify) => {
  fastify.register(async (instance) => {
	instance.addHook("preHandler", isAuthenticated);

	instance.get("/cart", cartController.getCart);
	instance.post("/cart/items", cartController.addItem);
	instance.patch("/cart/items", cartController.updateItem);
	instance.delete("/cart/items", cartController.removeItem);
	instance.delete("/cart", cartController.clearCart);
  });
};

export default cartRoute;
