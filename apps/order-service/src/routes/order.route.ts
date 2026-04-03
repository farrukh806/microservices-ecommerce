import { Router } from "fastify";
import { orderController } from "../controllers/order.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = Router({ prefix: "/orders" });

// All routes require authentication
router.addHook("preHandler", isAuthenticated);

router.post("/", orderController.createOrder);
router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrderById);
router.patch("/:id/status", orderController.updateOrderStatus);

export default router;
