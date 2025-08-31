// api-gateway/src/routes/investor-proxy.ts
import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { requireAuth } from "../middlewares/auth";
import { requireFeature } from "../middlewares/requireFeature";
import { jwtMw } from "@msmebazaar/shared/auth";
import { Config } from "../config";

import { Feature } from "@msmebazaar/types/feature";

const router: Router = Router();

// Apply auth and feature gating before proxying requests to investor service
router.use(
  "/investor",
  jwtMw(Config["jwtSecret"], true),  // Add JWT middleware for authentication
  requireAuth,
  requireFeature(Feature.INVESTOR_SERVICES), // Gates entire investor API to allowed users
  createProxyMiddleware({
    target: process.env.INVESTOR_SERVICE_URL || "http://localhost:8005",
    changeOrigin: true,
    pathRewrite: { "^/investor": "/investor" },
  })
);

export default router;
