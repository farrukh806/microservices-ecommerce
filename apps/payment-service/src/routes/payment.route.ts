import { Hono } from "hono";
import { paymentController } from "../controllers/payment.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

const app = new Hono();

app.post("/payment/intent", isAuthenticated, paymentController.createPaymentIntent);
app.get("/payment/:orderId", isAuthenticated, paymentController.getPayment);
app.post("/webhook", paymentController.webhook);

export default app;
