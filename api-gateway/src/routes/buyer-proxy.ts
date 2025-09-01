//buyer-proxy.ts
import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { requireAuth } from "../middlewares/auth";
import { requireFeature } from "../middlewares/requireFeature";
import { jwtMw } from "@msmebazaar/shared/auth";
import { Config } from "../config";
import { Feature } from "@msmebazaar/types/feature";

const router: Router = Router();

// Get service URL from environment or use default
const BUYER_SERVICE_URL = process.env.BUYER_SERVICE_URL || "http://localhost:8001";

console.log('[Buyer Proxy] Using BUYER_SERVICE_URL:', BUYER_SERVICE_URL);

// Logging middleware
router.use((req, res, next) => {
  console.log(`[Buyer Proxy] Received: ${req.method} ${req.originalUrl}`);
  next();
});

// Common error handler for proxy middleware
const createErrorHandler = (routeName: string) => {
  return (err: any, req: any, res: any) => {
    console.error(`[Buyer Proxy Error] ${routeName} - ${req.method} ${req.originalUrl}:`, err.message);
    if (!res.headersSent) {
      res.status(502).json({
        error: 'Bad Gateway',
        message: `Service temporarily unavailable: ${err.message}`,
        route: routeName
      });
    }
  };
};

// Common proxy configuration
const createProxyConfig = (pathRewrite: Record<string, string>, routeName: string) => ({
  target: BUYER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite,
  on: {
    error: createErrorHandler(routeName),
    proxyReq: (proxyReq: any, req: any, res: any) => {
      console.log(`[Buyer Proxy] Proxying ${req.method} ${req.originalUrl} to ${BUYER_SERVICE_URL}${proxyReq.path}`);
    },
    proxyRes: (proxyRes: any, req: any, res: any) => {
      console.log(`[Buyer Proxy] Response from ${routeName}: ${proxyRes.statusCode}`);
    }
  }
});

// Buyer service routes
router.use(
  "/buyer",
  jwtMw(Config["jwtSecret"], true),
  requireAuth,
  requireFeature(Feature.BUYER_SERVICES),
  createProxyMiddleware(
    createProxyConfig({ "^/buyer": "/buyer" }, 'buyer-service')
  )
);

// Health check endpoint
router.use('/buyer/health', createProxyMiddleware({
  target: BUYER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/buyer/health': '/health' },
  on: {
    error: createErrorHandler('buyer-health'),
    proxyReq: (proxyReq: any, req: any, res: any) => {
      console.log(`[Buyer Proxy] Health check: ${req.method} ${req.originalUrl}`);
    }
  }
}));

// Catch-all for unmatched buyer routes
router.use((req, res) => {
  console.warn(`[Buyer Proxy] No route matched: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Not Found',
    message: `Buyer route not found: ${req.originalUrl}`,
    availableRoutes: [
      '/buyer', '/buyer/health'
    ]
  });
});

export default router;
