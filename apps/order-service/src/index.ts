import Fastify from "fastify";
import { clerkPlugin } from "@clerk/fastify";
import dotenv from "dotenv";
import { isAuthenticated } from "./middleware/auth.js";
import orderRouter from "./routes/order.route.js";
import cartRouter from "./routes/cart.route.js";
import { errorHandler } from "./middleware/error.js";
dotenv.config();
const PORT = 8001;

const fastify = Fastify();

fastify.setErrorHandler(errorHandler);
fastify.register(clerkPlugin);

// Declare a route
fastify.get("/", { preHandler: isAuthenticated }, function (request, reply) {
  reply.send({ hello: "world" });
});

fastify.register(orderRouter);
fastify.register(cartRouter);

// Run the server!
fastify.listen({ port: PORT }, function (err, address) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
  console.log(`Order service is running on port ${address}`);
});
