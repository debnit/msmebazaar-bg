// api-gateway/src/routes/payment-proxy.ts
import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { requireAuth } from "../middlewares/auth";
import { requireFeature } from "../middlewares/requireFeature";
import { jwtMw } from "@msmebazaar/shared/auth";
import { Config } from "../config";

import { Feature } from "@msmebazaar/types/feature";

const router: Router = Router();

// Apply auth and feature gating before proxying requests to payment service
router.use(
  "/payment",
  jwtMw(Config["jwtSecret"], true),  // Add JWT middleware for authentication
  requireAuth,
  requireFeature(Feature.PAYMENT_SERVICES), // Gates entire payment API to allowed users
  createProxyMiddleware({
    target: process.env.PAYMENT_SERVICE_URL || "http://localhost:8009",
    changeOrigin: true,
    pathRewrite: { "^/payment": "/payment" },
  })
);

// Apply auth and feature gating before proxying requests to transaction matching service
router.use(
  "/transaction-matching",
  jwtMw(Config["jwtSecret"], true),  // Add JWT middleware for authentication
  requireAuth,
  requireFeature(Feature.TRANSACTION_MATCHING_SERVICES), // Gates entire transaction matching API to allowed users
  createProxyMiddleware({
    target: process.env.TRANSACTION_MATCHING_SERVICE_URL || "http://localhost:8010",
    changeOrigin: true,
    pathRewrite: { "^/transaction-matching": "/transaction-matching" },
  })
);

export default router;
