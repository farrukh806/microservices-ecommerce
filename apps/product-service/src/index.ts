import dotenv from "dotenv";
import path from "node:path";

// Try multiple paths to find .env
const envPaths = [
  path.resolve(__dirname, "../../.env"),
  path.resolve(process.cwd(), ".env"),
];

for (const envPath of envPaths) {
  const result = dotenv.config({ path: envPath });
  if (!result.error) {
    console.log("Loaded .env from:", envPath);
    break;
  }
}

import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import productRouter from "./routes/product.route.js";
import categoryRouter from "./routes/category.route.js";
import userRouter from "./routes/user.route.js";
import { validationErrorHandler } from "./middleware/validation.js";

const app = express();
const PORT = 8000;
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  }),
);

app.use(clerkMiddleware({ secretKey: process.env.CLERK_SECRET_KEY }));
app.use(express.json());

app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use("/users", userRouter);

app.use(validationErrorHandler);

app.listen(PORT, () => console.log(`Product service running at ${PORT}`));
