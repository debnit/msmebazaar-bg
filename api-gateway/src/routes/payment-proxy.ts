// api-gateway/src/routes/payment-proxy.ts
import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { requireAuth } from "../middlewares/auth";
import { requireFeature } from "../middlewares/requireFeature";

import { Feature } from "../../../shared/config/featureFlagTypes";

const router = Router();

// Apply auth and feature gating before proxying requests to payment service
router.use(
  "/payments",
  requireAuth,
  requireFeature(Feature.PAYMENTS), // Gates entire payments API to allowed users
  createProxyMiddleware({
    target: process.env.PAYMENT_SERVICE_URL || "http://localhost:4004",
    changeOrigin: true,
    pathRewrite: { "^/payments": "" },
  })
);
// Razorpay webhook endpoint - no auth required for external webhook calls
router.use(
  "/razorpay/webhook",
  createProxyMiddleware({
    target: process.env.PAYMENT_SERVICE_URL || "http://localhost:4004",
    changeOrigin: true,
    pathRewrite: { "^/razorpay/webhook": "/razorpay/webhook" },
  })
);


export default router;
