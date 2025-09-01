import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { requireAuth } from "../middlewares/auth";
import { requireFeature } from "../middlewares/requireFeature";
import { jwtMw } from "@msmebazaar/shared/auth";
import { Config } from "../config";
import { Feature } from "@msmebazaar/types/feature";

const router: Router = Router();

// Get service URL from environment or use default
const SUPERADMIN_SERVICE_URL = process.env.SUPERADMIN_SERVICE_URL || "http://localhost:8010";

console.log('[Superadmin Proxy] Using SUPERADMIN_SERVICE_URL:', SUPERADMIN_SERVICE_URL);

// Logging middleware
router.use((req, res, next) => {
  console.log(`[Superadmin Proxy] Received: ${req.method} ${req.originalUrl}`);
  next();
});

// Common error handler for proxy middleware
const createErrorHandler = (routeName: string) => {
  return (err: any, req: any, res: any) => {
    console.error(`[Superadmin Proxy Error] ${routeName} - ${req.method} ${req.originalUrl}:`, err.message);
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
  target: SUPERADMIN_SERVICE_URL,
  changeOrigin: true,
  pathRewrite,
  on: {
    error: createErrorHandler(routeName),
    proxyReq: (proxyReq: any, req: any, res: any) => {
      console.log(`[Superadmin Proxy] Proxying ${req.method} ${req.originalUrl} to ${SUPERADMIN_SERVICE_URL}${proxyReq.path}`);
    },
    proxyRes: (proxyRes: any, req: any, res: any) => {
      console.log(`[Superadmin Proxy] Response from ${routeName}: ${proxyRes.statusCode}`);
    }
  }
});

// Superadmin service routes
router.use(
  "/superadmin",
  jwtMw(Config["jwtSecret"], true),
  requireAuth,
  requireFeature(Feature.SUPER_ADMIN_SERVICES),
  createProxyMiddleware(
    createProxyConfig({ "^/superadmin": "/superadmin" }, 'superadmin-service')
  )
);

// Health check endpoint
router.use('/superadmin/health', createProxyMiddleware({
  target: SUPERADMIN_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/superadmin/health': '/health' },
  on: {
    error: createErrorHandler('superadmin-health'),
    proxyReq: (proxyReq: any, req: any, res: any) => {
      console.log(`[Superadmin Proxy] Health check: ${req.method} ${req.originalUrl}`);
    }
  }
}));

// Catch-all for unmatched superadmin routes
router.use((req, res) => {
  console.warn(`[Superadmin Proxy] No route matched: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Not Found',
    message: `Superadmin route not found: ${req.originalUrl}`,
    availableRoutes: [
      '/superadmin', '/superadmin/health'
    ]
  });
});

export default router;
