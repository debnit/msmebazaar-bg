import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { requireAuth } from "../middlewares/auth";
import { requireFeature } from "../middlewares/requireFeature";
import { Feature } from "@shared/config/featureFlagTypes";

const router = Router();

// Loan service routes with authentication and feature gating
router.use(
  "/loans",
  requireAuth,
  requireFeature(Feature.LOAN_SERVICES),
  createProxyMiddleware({
    target: process.env.LOAN_SERVICE_URL || "http://localhost:8013",
    changeOrigin: true,
    pathRewrite: { "^/loans": "" },
  })
);

// Loan eligibility check (public route)
router.use(
  "/loans/eligibility",
  createProxyMiddleware({
    target: process.env.LOAN_SERVICE_URL || "http://localhost:8013",
    changeOrigin: true,
    pathRewrite: { "^/loans/eligibility": "/eligibility" },
  })
);

export default router;
