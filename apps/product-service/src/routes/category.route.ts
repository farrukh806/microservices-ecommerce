import { Router } from "express";
import { categoryController } from "../controllers/category.controller.js";

const router = Router();

router.route("/").post(categoryController.createCategory).get(categoryController.getCategories);

export default router;