import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { clerkMiddleware } from "@hono/clerk-auth";
import dotenv from "dotenv";
dotenv.config();
import paymentRouter from "./routes/payment.route.js";

const app = new Hono();
const PORT = 8002;

app.use("*", clerkMiddleware({ secretKey: process.env.SECRET_KEY }));

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
