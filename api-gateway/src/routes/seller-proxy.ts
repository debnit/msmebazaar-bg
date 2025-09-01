// api-gateway/src/routes/seller-proxy.ts
import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { requireAuth } from "../middlewares/auth";
import { requireFeature } from "../middlewares/requireFeature";
import { jwtMw } from "@msmebazaar/shared/auth";
import { Config } from "../config";
import { Feature } from "@msmebazaar/types/feature";

const router: Router = Router();

// Get service URL from environment or use default
const SELLER_SERVICE_URL = process.env.SELLER_SERVICE_URL || "http://localhost:8002";

console.log('[Seller Proxy] Using SELLER_SERVICE_URL:', SELLER_SERVICE_URL);

// Logging middleware
router.use((req, res, next) => {
  console.log(`[Seller Proxy] Received: ${req.method} ${req.originalUrl}`);
  next();
});

// Common error handler for proxy middleware
const createErrorHandler = (routeName: string) => {
  return (err: any, req: any, res: any) => {
    console.error(`[Seller Proxy Error] ${routeName} - ${req.method} ${req.originalUrl}:`, err.message);
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
  target: SELLER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite,
  onError: createErrorHandler(routeName),
  onProxyReq: (proxyReq: any, req: any, res: any) => {
    console.log(`[Seller Proxy] Proxying ${req.method} ${req.originalUrl} to ${SELLER_SERVICE_URL}${proxyReq.path}`);
  },
  onProxyRes: (proxyRes: any, req: any, res: any) => {
    console.log(`[Seller Proxy] Response from ${routeName}: ${proxyRes.statusCode}`);
  }
});

// Seller service routes
router.use(
  "/seller",
  jwtMw(Config["jwtSecret"], true),
  requireAuth,
  requireFeature(Feature.SELLER_SERVICES),
  createProxyMiddleware(
    createProxyConfig({ "^/seller": "/seller" }, 'seller-service')
  )
);

// Health check endpoint
router.use('/seller/health', createProxyMiddleware({
  target: SELLER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/seller/health': '/health' },
  on: {
    error: createErrorHandler('seller-health'),
    proxyReq: (proxyReq: any, req: any, res: any) => {
      console.log(`[Seller Proxy] Health check: ${req.method} ${req.originalUrl}`);
    }
  }
}));

// Catch-all for unmatched seller routes
router.use((req, res) => {
  console.warn(`[Seller Proxy] No route matched: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Not Found',
    message: `Seller route not found: ${req.originalUrl}`,
    availableRoutes: [
      '/seller', '/seller/health'
    ]
  });
});

export default router;
