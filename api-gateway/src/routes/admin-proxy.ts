// api-gateway/src/routes/admin-proxy.ts
import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { requireAuth } from "../middlewares/auth";
import { requireFeature } from "../middlewares/requireFeature";
import { jwtMw } from "@msmebazaar/shared/auth";
import { Config } from "../config";

import { Feature } from "@msmebazaar/types/feature";

const router: Router = Router();

// Apply auth and feature gating before proxying requests to admin service
router.use(
  "/admin",
  jwtMw(Config["jwtSecret"], true),  // Add JWT middleware for authentication
  requireAuth,
  requireFeature(Feature.ADMIN_SERVICES), // Gates entire admin API to allowed users
  createProxyMiddleware({
    target: process.env.ADMIN_SERVICE_URL || "http://localhost:8003",
    changeOrigin: true,
    pathRewrite: { "^/admin": "/admin" },
  })
);

export default router;
