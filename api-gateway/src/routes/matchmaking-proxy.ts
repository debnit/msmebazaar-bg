import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { requireAuth } from "../middlewares/auth";
import { requireFeature } from "../middlewares/requireFeature";
import { jwtMw } from "@msmebazaar/shared/auth";
import { Config } from "../config";

import { Feature } from "@msmebazaar/types/feature";

const router: Router = Router();

// Apply auth and feature gating before proxying requests to matchmaking service
router.use(
  '/matchmaking',
  jwtMw(Config["jwtSecret"], true),  // Add JWT middleware for authentication
  requireAuth,
  requireFeature(Feature.MATCHMAKING), // Gates entire matchmaking API to allowed users
  createProxyMiddleware({
    target: process.env.MATCHMAKING_SERVICE_URL || 'http://localhost:8007', // Use environment variable or default
    changeOrigin: true,
    pathRewrite: { '^/api/matchmaking': '' },
    // Optionally: onProxyReq, onProxyRes hooks for logging/auth
  })
);

export default router;
