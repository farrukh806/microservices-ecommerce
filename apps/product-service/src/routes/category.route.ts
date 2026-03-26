import { Router } from "express";
import { categoryController } from "../controllers/category.controller";

const router = Router();

router.route("/").post(categoryController.createCategory);

export default router;