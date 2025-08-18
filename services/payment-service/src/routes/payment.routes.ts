import { Router } from "express";
import { requireAuth, requireProUser, requireAdmin } from "../middlewares/auth";
import { requireFeature } from "../middlewares/featureGating";
import {
  createPaymentController,
  updatePaymentStatusController,
  // Assume these controllers exist
  createProSubscriptionController,
  getPaymentAnalyticsController,
} from "../controllers/payment.controller";
import { Feature } from "../../../shared/config/featureFlagTypes";

const router = Router();

router.post("/", requireAuth, requireFeature(Feature.PAYMENTS), createPaymentController);
router.post("/subscription/pro", requireAuth, requireProUser, createProSubscriptionController);
router.patch("/:paymentId/status", requireAuth, requireAdmin, updatePaymentStatusController);
router.get("/analytics", requireAuth, requireAdmin, getPaymentAnalyticsController);

export default router;
