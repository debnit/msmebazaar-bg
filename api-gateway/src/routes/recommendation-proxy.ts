import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { requireAuth } from "../middlewares/auth";
import { requireFeature } from "../middlewares/requireFeature";
import { jwtMw } from "@msmebazaar/shared/auth";
import { Config } from "../config";
import { Feature } from "@msmebazaar/types/feature";

const router: Router = Router();

// Get service URL from environment or use default
const RECOMMENDATION_SERVICE_URL = process.env.RECOMMENDATION_SERVICE_URL || "http://localhost:8018";

console.log('[Recommendation Proxy] Using RECOMMENDATION_SERVICE_URL:', RECOMMENDATION_SERVICE_URL);

// Logging middleware
router.use((req, res, next) => {
  console.log(`[Recommendation Proxy] Received: ${req.method} ${req.originalUrl}`);
  next();
});

// Common error handler for proxy middleware
const createErrorHandler = (routeName: string) => {
  return (err: any, req: any, res: any) => {
    console.error(`[Recommendation Proxy Error] ${routeName} - ${req.method} ${req.originalUrl}:`, err.message);
    if (!res.headersSent) {
      res.status(502).json({ 
        error: 'Bad Gateway', 
        message: `Service temporarily unavailable: ${err.message}`,
        route: routeName
      });
    }
  };
};

// Health check endpoint
router.use('/health', createProxyMiddleware({
  target: RECOMMENDATION_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/health': '/health' },
  on: {
    error: createErrorHandler('recommendation-health'),
    proxyReq: (proxyReq: any, req: any, res: any) => {
      console.log(`[Recommendation Proxy] Health check: ${req.method} ${req.originalUrl}`);
    }
  }
}));

// Recommendation service routes - Remove /api/recommendations prefix and route to /recommendations
router.use(
  
  jwtMw(Config["jwtSecret"], true),
  requireAuth,
  requireFeature(Feature.RECOMMENDATIONS),
  createProxyMiddleware({
    target: RECOMMENDATION_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/": "/recommendations" },
    on: {
      error: createErrorHandler('recommendation-service'),
      proxyReq: (proxyReq: any, req: any, res: any) => {
        console.log(`[Recommendation Proxy] Proxying ${req.method} ${req.originalUrl} to ${RECOMMENDATION_SERVICE_URL}${proxyReq.path}`);
      },
      proxyRes: (proxyRes: any, req: any, res: any) => {
        console.log(`[Recommendation Proxy] Response from recommendation-service: ${proxyRes.statusCode}`);
      }
    }
  })
);

export default router;
