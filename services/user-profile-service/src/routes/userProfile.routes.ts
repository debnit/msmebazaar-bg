import { Router } from "express";
import {  requireRole } from "@msmebazaar/shared/middleware/auth";
import {
  getProfileController,
  updateProfileController,
  getProProfileAnalyticsController
} from "../controllers/userProfile.controller";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.get("/profile", requireAuth, getProfileController);
router.put("/profile", requireAuth, updateProfileController);
router.get("/profile/advanced-analytics", requireAuth, requireRole, getProProfileAnalyticsController);

export default router;
