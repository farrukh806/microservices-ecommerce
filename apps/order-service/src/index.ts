import dotenv from "dotenv";
import path from "node:path";
dotenv.config(path.resolve(__dirname, "../../.env"));

import Fastify from "fastify";
import cors from "@fastify/cors";
import { clerkPlugin } from "@clerk/fastify";
import { isAuthenticated } from "./middleware/auth.js";
import orderRouter from "./routes/order.route.js";
import cartRouter from "./routes/cart.route.js";
import { errorHandler } from "./middleware/error.js";

const PORT = 8001;

// Validate Clerk keys are present
const clerkSecretKey = process.env.CLERK_SECRET_KEY;
const clerkPublishableKey = process.env.CLERK_PUBLISHABLE_KEY;

if (!clerkSecretKey || !clerkPublishableKey) {
  console.error("ERROR: CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY are required");
  process.exit(1);
}

const fastify = Fastify();

await fastify.register(cors, {
  origin: true,
  credentials: true,
});

fastify.setErrorHandler(errorHandler);

fastify.register(clerkPlugin, {
  secretKey: clerkSecretKey,
  publishableKey: clerkPublishableKey,
});

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
