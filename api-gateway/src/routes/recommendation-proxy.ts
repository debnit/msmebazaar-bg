import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { requireAuth } from "../middlewares/auth";
import { requireFeature } from "../middlewares/requireFeature";
import { jwtMw } from "@msmebazaar/shared/auth";
import { Config } from "../config";

import { Feature } from "@msmebazaar/types/feature";

const router: Router = Router();

// Apply auth and feature gating before proxying requests to recommendation service
router.use(
  "/recommendations",
  jwtMw(Config["jwtSecret"], true),  // Add JWT middleware for authentication
  requireAuth,
  requireFeature(Feature.RECOMMENDATIONS), // Gates entire recommendation API to allowed users
  createProxyMiddleware({
    target: process.env.RECOMMENDATION_SERVICE_URL || "http://localhost:8018",
    changeOrigin: true,
    pathRewrite: { "^/api/recommendations": "" },
  })
);

export default router;
