import { FastifyPluginAsync } from "fastify";
import { wishlistController } from "../controllers/wishlist.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

const wishlistRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", isAuthenticated);

  fastify.get("/wishlist", wishlistController.getWishlist);
  fastify.post("/wishlist", wishlistController.addItem);
  fastify.delete("/wishlist/:productId", wishlistController.removeItem);
};

export default wishlistRoutes;