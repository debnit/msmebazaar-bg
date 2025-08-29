// api-gateway/src/routes/buyer-proxy.ts
import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { requireAuth } from "../middlewares/auth";
import { requireFeature } from "../middlewares/requireFeature";

import { Feature } from "@msmebazaar/types/feature";

const router: Router = Router();

// Apply auth and feature gating before proxying requests to buyer service
router.use(
  "/buyer",
  requireAuth,
  requireFeature(Feature.BUYER_SERVICES), // Gates entire buyer API to allowed users
  createProxyMiddleware({
    target: process.env.BUYER_SERVICE_URL || "http://localhost:8001",
    changeOrigin: true,
    pathRewrite: { "^/buyer": "/buyer" },
  })
);

export default router;
