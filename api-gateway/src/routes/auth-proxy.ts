// api-gateway/src/routes/auth-proxy.ts
import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { requireAuth } from "../middlewares/auth";
import { requireFeature } from "../middlewares/requireFeature";

import { Feature } from "@shared/config/featureFlagTypes";

const router = Router();

// Auth service routes - some endpoints don't require auth (login, register)
router.use(
  "/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || "http://localhost:8000",
    changeOrigin: true,
    pathRewrite: { "^/auth": "/auth" },
  })
);

// Protected auth routes that require authentication
router.use(
  "/auth/protected",
  requireAuth,
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || "http://localhost:8000",
    changeOrigin: true,
    pathRewrite: { "^/auth/protected": "/auth" },
  })
);

export default router;
