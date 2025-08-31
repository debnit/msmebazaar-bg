import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { requireAuth } from "../middlewares/auth";
import { requireFeature } from "../middlewares/requireFeature";
import { jwtMw } from "@msmebazaar/shared/auth";
import { Config } from "../config";

import { Feature } from "@msmebazaar/types/feature";

const router: Router = Router();

// Apply auth and feature gating before proxying requests to agent service
router.use(
  "/agent",
  jwtMw(Config["jwtSecret"], true),  // Add JWT middleware for authentication
  requireAuth,
  requireFeature(Feature.AGENT_SERVICES), // Gates entire agent API to allowed users
  createProxyMiddleware({
    target: process.env.AGENT_SERVICE_URL || "http://localhost:8008",
    changeOrigin: true,
    pathRewrite: { "^/agent": "/agent" },
  })
);

export default router;
