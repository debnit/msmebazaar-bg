import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { requireAuth } from "../middlewares/auth";
import { requireFeature } from "../middlewares/requireFeature";
import { Feature } from "@shared/config/featureFlagTypes";

const router = Router();

// Agent service routes with authentication and feature gating
router.use(
  "/agent",
  requireAuth,
  requireFeature(Feature.AGENT_SERVICES),
  createProxyMiddleware({
    target: process.env.AGENT_SERVICE_URL || "http://localhost:8015",
    changeOrigin: true,
    pathRewrite: { "^/agent": "" },
  })
);

export default router;
