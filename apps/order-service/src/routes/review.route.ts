import { FastifyPluginAsync } from "fastify";
import { reviewController } from "../controllers/review.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

const reviewRoutes: FastifyPluginAsync = async (fastify) => {
  // GET reviews is public, POST and vote require auth
  fastify.get("/reviews", reviewController.getReviews);

  fastify.addHook("preHandler", isAuthenticated);
  fastify.post("/reviews", reviewController.createReview);
  fastify.post("/reviews/:id/vote", reviewController.voteReview);
};

export default reviewRoutes;