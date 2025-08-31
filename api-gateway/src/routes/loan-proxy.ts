import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { requireAuth } from "../middlewares/auth";
import { requireFeature } from "../middlewares/requireFeature";
import { jwtMw } from "@msmebazaar/shared/auth";
import { Config } from "../config";

import { Feature } from "@msmebazaar/types/feature";

const router: Router = Router();

// Apply auth and feature gating before proxying requests to loan service
router.use(
  "/loan",
  jwtMw(Config["jwtSecret"], true),  // Add JWT middleware for authentication
  requireAuth,
  requireFeature(Feature.LOAN_SERVICES), // Gates entire loan API to allowed users
  createProxyMiddleware({
    target: process.env.LOAN_SERVICE_URL || "http://localhost:8006",
    changeOrigin: true,
    pathRewrite: { "^/loan": "/loan" },
  })
);

// Apply auth and feature gating before proxying requests to compliance service
router.use(
  "/compliance",
  jwtMw(Config["jwtSecret"], true),  // Add JWT middleware for authentication
  requireAuth,
  requireFeature(Feature.COMPLIANCE_SERVICES), // Gates entire compliance API to allowed users
  createProxyMiddleware({
    target: process.env.COMPLIANCE_SERVICE_URL || "http://localhost:8007",
    changeOrigin: true,
    pathRewrite: { "^/compliance": "/compliance" },
  })
);

export default router;
