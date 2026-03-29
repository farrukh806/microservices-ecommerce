import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import productRouter from "./routes/product.route.js";
import categoryRouter from "./routes/category.route.js";
import { validationErrorHandler } from "./middleware/validation.js";
dotenv.config();

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

app.use(validationErrorHandler);

app.listen(PORT, () => console.log(`Product service running at ${PORT}`));
