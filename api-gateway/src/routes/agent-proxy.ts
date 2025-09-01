import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { requireAuth } from "../middlewares/auth";
import { requireFeature } from "../middlewares/requireFeature";
import { jwtMw } from "@msmebazaar/shared/auth";
import { Config } from "../config";
import { Feature } from "@msmebazaar/types/feature";

const router: Router = Router();

// Get service URL from environment or use default
const AGENT_SERVICE_URL = process.env.AGENT_SERVICE_URL || "http://localhost:8012";

console.log('[Agent Proxy] Using AGENT_SERVICE_URL:', AGENT_SERVICE_URL);

// Logging middleware
router.use((req, res, next) => {
  console.log(`[Agent Proxy] Received: ${req.method} ${req.originalUrl}`);
  next();
});

// Common error handler for proxy middleware
const createErrorHandler = (routeName: string) => {
  return (err: any, req: any, res: any) => {
    console.error(`[Agent Proxy Error] ${routeName} - ${req.method} ${req.originalUrl}:`, err.message);
    if (!res.headersSent) {
      res.status(502).json({
        error: 'Bad Gateway',
        message: `Service temporarily unavailable: ${err.message}`,
        route: routeName
      });
    }
  };
};

// Proxy config helper for agent routes
const createProxyConfig = (pathRewrite: Record<string, string>, routeName: string) => ({
  target: AGENT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite,
  on: {
    error: createErrorHandler(routeName),
    proxyReq: (proxyReq: any, req: any, res: any) => {
      console.log(`[Agent Proxy] Proxying ${req.method} ${req.originalUrl} to ${AGENT_SERVICE_URL}${proxyReq.path}`);
    },
    proxyRes: (proxyRes: any, req: any, res: any) => {
      console.log(`[Agent Proxy] Response from ${routeName}: ${proxyRes.statusCode}`);
    }
  }
});

// Agent service routes
router.use(
  "/agent",
  jwtMw(Config["jwtSecret"], true),
  requireAuth,
  requireFeature(Feature.AGENT_SERVICES),
  createProxyMiddleware(
    createProxyConfig({ "^/agent": "/agent" }, 'agent-service')
  )
);

// Health check endpoint
router.use('/agent/health', createProxyMiddleware({
  target: AGENT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/agent/health': '/health' },
  on: {
    error: createErrorHandler('agent-health'),
    proxyReq: (proxyReq: any, req: any, res: any) => {
      console.log(`[Agent Proxy] Health check: ${req.method} ${req.originalUrl}`);
    }
  }
}));

// Catch-all for unmatched agent routes
router.use((req, res) => {
  console.warn(`[Agent Proxy] No route matched: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Not Found',
    message: `Agent route not found: ${req.originalUrl}`,
    availableRoutes: [
      '/agent', '/agent/health'
    ]
  });
});

export default router;
