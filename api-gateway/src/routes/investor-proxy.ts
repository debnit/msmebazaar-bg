import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { requireAuth } from "../middlewares/auth";
import { requireFeature } from "../middlewares/requireFeature";
import { jwtMw } from "@msmebazaar/shared/auth";
import { Config } from "../config";
import { Feature } from "@msmebazaar/types/feature";

const router: Router = Router();

// Get service URL from environment or use default
const INVESTOR_SERVICE_URL = process.env.INVESTOR_SERVICE_URL || "http://localhost:8011";

console.log('[Investor Proxy] Using INVESTOR_SERVICE_URL:', INVESTOR_SERVICE_URL);

// Logging middleware
router.use((req, res, next) => {
  console.log(`[Investor Proxy] Received: ${req.method} ${req.originalUrl}`);
  next();
});

// Common error handler for proxy middleware
const createErrorHandler = (routeName: string) => {
  return (err: any, req: any, res: any) => {
    console.error(`[Investor Proxy Error] ${routeName} - ${req.method} ${req.originalUrl}:`, err.message);
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
  target: INVESTOR_SERVICE_URL,
  changeOrigin: true,
  pathRewrite,
  on: {
    error: createErrorHandler(routeName),
    proxyReq: (proxyReq: any, req: any, res: any) => {
      console.log(`[Investor Proxy] Proxying ${req.method} ${req.originalUrl} to ${INVESTOR_SERVICE_URL}${proxyReq.path}`);
    },
    proxyRes: (proxyRes: any, req: any, res: any) => {
      console.log(`[Investor Proxy] Response from ${routeName}: ${proxyRes.statusCode}`);
    }
  }
});

// Investor service routes
router.use(
  "/investor",
  jwtMw(Config["jwtSecret"], true),
  requireAuth,
  requireFeature(Feature.INVESTOR_SERVICES),
  createProxyMiddleware(
    createProxyConfig({ "^/investor": "/investor" }, 'investor-service')
  )
);

// Health check endpoint
router.use('/investor/health', createProxyMiddleware({
  target: INVESTOR_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/investor/health': '/health' },
  on: {
    error: createErrorHandler('investor-health'),
    proxyReq: (proxyReq: any, req: any, res: any) => {
      console.log(`[Investor Proxy] Health check: ${req.method} ${req.originalUrl}`);
    }
  }
}));

// Catch-all for unmatched investor routes
router.use((req, res) => {
  console.warn(`[Investor Proxy] No route matched: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Not Found',
    message: `Investor route not found: ${req.originalUrl}`,
    availableRoutes: [
      '/investor', '/investor/health'
    ]
  });
});

export default router;
