import { Router } from "express";
import { userController } from "../controllers/user.controller.js";

const router = Router();

router.route("/").get(userController.getUsers);
router.route("/:id").get(userController.getUserById);
router.route("/:id").put(userController.updateUser);
router.route("/:id").delete(userController.deleteUser);

export default router;