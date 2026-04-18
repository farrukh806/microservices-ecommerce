import { Router } from "express";
import { settingsController } from "../controllers/settings.controller.js";

const router = Router();

router
  .route("/storefront-theme")
  .get(settingsController.getStorefrontTheme)
  .put(settingsController.upsertStorefrontTheme);

export default router;
