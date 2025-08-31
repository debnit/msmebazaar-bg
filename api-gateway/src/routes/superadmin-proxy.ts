// api-gateway/src/routes/superadmin-proxy.ts
import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { requireAuth } from "../middlewares/auth";
import { requireFeature } from "../middlewares/requireFeature";
import { jwtMw } from "@msmebazaar/shared/auth";
import { Config } from "../config";

import { Feature } from "@msmebazaar/types/feature";

const router: Router = Router();

// Apply auth and feature gating before proxying requests to superadmin service
router.use(
  "/superadmin",
  jwtMw(Config["jwtSecret"], true),  // Add JWT middleware for authentication
  requireAuth,
  requireFeature(Feature.SUPER_ADMIN_SERVICES), // Gates entire superadmin API to allowed users
  createProxyMiddleware({
    target: process.env.SUPERADMIN_SERVICE_URL || "http://localhost:8004",
    changeOrigin: true,
    pathRewrite: { "^/superadmin": "/superadmin" },
  })
);

export default router;
