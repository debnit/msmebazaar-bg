import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { requireAuth } from "../middlewares/auth";
import { requireFeature } from "../middlewares/requireFeature";
import { jwtMw } from "@msmebazaar/shared/auth";
import { Config } from "../config";
import { Feature } from "@msmebazaar/types/feature";

const router: Router = Router();

// Get service URLs from environment or use defaults
const LOAN_SERVICE_URL = process.env.LOAN_SERVICE_URL || "http://localhost:8006";
const COMPLIANCE_SERVICE_URL = process.env.COMPLIANCE_SERVICE_URL || "http://localhost:8010";

console.log('[Loan Proxy] Using LOAN_SERVICE_URL:', LOAN_SERVICE_URL);
console.log('[Loan Proxy] Using COMPLIANCE_SERVICE_URL:', COMPLIANCE_SERVICE_URL);

// Logging middleware
router.use((req, res, next) => {
  console.log(`[Loan Proxy] Received: ${req.method} ${req.originalUrl}`);
  next();
});

// Common error handler for proxy middleware
const createErrorHandler = (routeName: string) => {
  return (err: any, req: any, res: any) => {
    console.error(`[Loan Proxy Error] ${routeName} - ${req.method} ${req.originalUrl}:`, err.message);
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
const createProxyConfig = (target: string, pathRewrite: Record<string, string>, routeName: string) => ({
  target,
  changeOrigin: true,
  pathRewrite,
  on: {
    error: createErrorHandler(routeName),
    proxyReq: (proxyReq: any, req: any, res: any) => {
      console.log(`[Loan Proxy] Proxying ${req.method} ${req.originalUrl} to ${target}${proxyReq.path}`);
    },
    proxyRes: (proxyRes: any, req: any, res: any) => {
      console.log(`[Loan Proxy] Response from ${routeName}: ${proxyRes.statusCode}`);
    }
  }
});

// Loan service routes
router.use(
  "/loan",
  jwtMw(Config["jwtSecret"], true),
  requireAuth,
  requireFeature(Feature.LOAN_SERVICES),
  createProxyMiddleware(
    createProxyConfig(LOAN_SERVICE_URL, { "^/loan": "/loan" }, 'loan-service')
  )
);

// Compliance service routes
router.use(
  "/compliance",
  jwtMw(Config["jwtSecret"], true),
  requireAuth,
  requireFeature(Feature.COMPLIANCE_CHECKLIST),
  createProxyMiddleware(
    createProxyConfig(COMPLIANCE_SERVICE_URL, { "^/compliance": "/compliance" }, 'compliance-service')
  )
);

// Health check endpoints
router.use('/loan/health', createProxyMiddleware({
  target: LOAN_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/loan/health': '/health' },
  on: {
    error: createErrorHandler('loan-health'),
    proxyReq: (proxyReq: any, req: any, res: any) => {
      console.log(`[Loan Proxy] Health check: ${req.method} ${req.originalUrl}`);
    }
  }
}));

router.use('/compliance/health', createProxyMiddleware({
  target: COMPLIANCE_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/compliance/health': '/health' },
  on: {
    error: createErrorHandler('compliance-health'),
    proxyReq: (proxyReq: any, req: any, res: any) => {
      console.log(`[Loan Proxy] Health check: ${req.method} ${req.originalUrl}`);
    }
  }
}));

// Catch-all for unmatched loan routes
router.use((req, res) => {
  console.warn(`[Loan Proxy] No route matched: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Not Found',
    message: `Loan route not found: ${req.originalUrl}`,
    availableRoutes: [
      '/loan', '/compliance',
      '/loan/health', '/compliance/health'
    ]
  });
});

export default router;
