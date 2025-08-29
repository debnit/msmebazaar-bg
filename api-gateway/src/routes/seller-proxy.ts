// api-gateway/src/routes/seller-proxy.ts
import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { requireAuth } from "../middlewares/auth";
import { requireFeature } from "../middlewares/requireFeature";

import { Feature } from "@msmebazaar/types/feature";

const router: Router = Router();

// Apply auth and feature gating before proxying requests to seller service
router.use(
  "/seller",
  requireAuth,
  requireFeature(Feature.SELLER_SERVICES), // Gates entire seller API to allowed users
  createProxyMiddleware({
    target: process.env.SELLER_SERVICE_URL || "http://localhost:8014",
    changeOrigin: true,
    pathRewrite: { "^/seller": "/seller" },
  })
);

export default router;
