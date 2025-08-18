import { Router } from "express";
import { requireAuth, requireProUser, requireRole, requireAdmin } from "../../../shared/middleware/auth";
import {
  createPaymentController,
  updatePaymentStatusController,
  createProSubscriptionController,
  getPaymentAnalyticsController,
} from "../controllers/payment.controller";

const router = Router();

router.post("/", requireAuth, createPaymentController); // Any authenticated user
router.post("/subscription/pro", requireAuth, requireProUser, createProSubscriptionController); // Pro only
router.patch("/:paymentId/status", requireAuth, updatePaymentStatusController);
router.get("/analytics", requireAuth, requireAdmin, getPaymentAnalyticsController); // Admin only

export default router;
