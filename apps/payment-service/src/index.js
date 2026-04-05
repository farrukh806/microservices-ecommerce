import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { clerkMiddleware } from "@hono/clerk-auth";
import { cors } from "hono/cors";
import dotenv from "dotenv";
import { isAuthenticated } from "./middleware/auth.js";
import paymentRoutes from "./routes/payment.route.js";
dotenv.config();
const app = new Hono();
const PORT = 8002;

app.use("*", cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    credentials: true,
}));

app.use("*", clerkMiddleware({ secretKey: process.env.SECRET_KEY }));

app.route("/", paymentRoutes);

app.get("/", isAuthenticated, (c) => {
    return c.text("Hello Hono!");
});
serve({
    fetch: app.fetch,
    port: PORT,
}, (info) => {
    console.log(`Payment service is running on ${info.port}`);
});
