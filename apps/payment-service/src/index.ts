import dotenv from "dotenv";
import path from "node:path";
dotenv.config(path.resolve(__dirname, "../../.env"));

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { clerkMiddleware } from "@hono/clerk-auth";
import { cors } from "hono/cors";
import paymentRouter from "./routes/payment.route.js";

const app = new Hono();
const PORT = 8002;

app.use("*", cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    credentials: true,
}));

app.use("*", clerkMiddleware({ 
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.SECRET_KEY 
}));

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/", paymentRouter);

serve(
  {
    fetch: app.fetch,
    port: PORT,
  },
  (info) => {
    console.log(`Payment service is running on ${info.port}`);
  },
);
