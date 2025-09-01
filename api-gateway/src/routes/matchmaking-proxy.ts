import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { requireAuth } from "../middlewares/auth";
import { requireFeature } from "../middlewares/requireFeature";
import { jwtMw } from "@msmebazaar/shared/auth";
import { Config } from "../config";
import { Feature } from "@msmebazaar/types/feature";

const router: Router = Router();

// Get service URL from environment or use default
const MATCHMAKING_SERVICE_URL = process.env.MATCHMAKING_SERVICE_URL || 'http://localhost:8007';

console.log('[Matchmaking Proxy] Using MATCHMAKING_SERVICE_URL:', MATCHMAKING_SERVICE_URL);

// Logging middleware
router.use((req, res, next) => {
  console.log(`[Matchmaking Proxy] Received: ${req.method} ${req.originalUrl}`);
  next();
});

// Common error handler for proxy middleware
const createErrorHandler = (routeName: string) => {
  return (err: any, req: any, res: any) => {
    console.error(`[Matchmaking Proxy Error] ${routeName} - ${req.method} ${req.originalUrl}:`, err.message);
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
  target: MATCHMAKING_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/health': '/health' },
  on: {
    error: createErrorHandler('matchmaking-health'),
    proxyReq: (proxyReq: any, req: any, res: any) => {
      console.log(`[Matchmaking Proxy] Health check: ${req.method} ${req.originalUrl}`);
    }
  }
}));

// Matchmaking service routes - Remove /api/matchmaking prefix and route to /matchmaking
router.use(
  jwtMw(Config["jwtSecret"], true),
  requireAuth,
  requireFeature(Feature.MATCHMAKING),
  createProxyMiddleware({
    target: MATCHMAKING_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/': '/matchmaking' },
    on: {
      error: createErrorHandler('matchmaking-service'),
      proxyReq: (proxyReq: any, req: any, res: any) => {
        console.log(`[Matchmaking Proxy] Proxying ${req.method} ${req.originalUrl} to ${MATCHMAKING_SERVICE_URL}${proxyReq.path}`);
      },
      proxyRes: (proxyRes: any, req: any, res: any) => {
        console.log(`[Matchmaking Proxy] Response from matchmaking-service: ${proxyRes.statusCode}`);
      }
    }
  })
);

export default router;
