import { Router } from "express";
import { productController } from "../controllers/product.controller.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.route("/upload").post(upload.array("images", 10), productController.uploadImages);
router.route("/").post(productController.createProduct);
router.route("/").get(productController.getProducts);

export default router;