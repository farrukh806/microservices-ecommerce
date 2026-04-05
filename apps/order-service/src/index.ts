import dotenv from "dotenv";
import path from "node:path";
dotenv.config(path.resolve(__dirname, "../../.env"));

import Fastify from "fastify";
import cors from "@fastify/cors";
import cookieParser from "@fastify/cookie";
import { clerkPlugin } from "@clerk/fastify";
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
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
});

fastify.setErrorHandler(errorHandler);

// Register Clerk plugin first
fastify.register(clerkPlugin, {
  secretKey: clerkSecretKey,
  publishableKey: clerkPublishableKey,
});

// Then register cookie parser
await fastify.register(cookieParser);

console.log("Clerk keys loaded successfully");
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