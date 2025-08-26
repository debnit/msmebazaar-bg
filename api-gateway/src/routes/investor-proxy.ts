// api-gateway/src/routes/investor-proxy.ts
import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { requireAuth } from "../middlewares/auth";
import { requireFeature } from "../middlewares/requireFeature";
import { Feature } from "@shared/config/featureFlagTypes";

const router = Router();

// Investor service routes with authentication and feature gating
router.use(
  "/investor",
  requireAuth,
  requireFeature(Feature.INVESTOR_SERVICES),
  createProxyMiddleware({
    target: process.env.INVESTOR_SERVICE_URL || "http://localhost:8018",
    changeOrigin: true,
    pathRewrite: { "^/investor": "" },
  })
);

export default router;
