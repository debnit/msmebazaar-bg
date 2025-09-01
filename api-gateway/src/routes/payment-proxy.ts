// api-gateway/src/routes/payment-proxy.ts
import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { requireAuth } from "../middlewares/auth";
import { requireFeature } from "../middlewares/requireFeature";
import { jwtMw } from "@msmebazaar/shared/auth";
import { Config } from "../config";
import { Feature } from "@msmebazaar/types/feature";

const router: Router = Router();

// Get service URLs from environment or use defaults
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || "http://localhost:8009";
const TRANSACTION_MATCHING_SERVICE_URL = process.env.TRANSACTION_MATCHING_SERVICE_URL || "http://localhost:8010";

console.log('[Payment Proxy] Using PAYMENT_SERVICE_URL:', PAYMENT_SERVICE_URL);
console.log('[Payment Proxy] Using TRANSACTION_MATCHING_SERVICE_URL:', TRANSACTION_MATCHING_SERVICE_URL);

// Logging middleware
router.use((req, res, next) => {
  console.log(`[Payment Proxy] Received: ${req.method} ${req.originalUrl}`);
  next();
});

// Common error handler for proxy middleware
const createErrorHandler = (routeName: string) => {
  return (err: any, req: any, res: any) => {
    console.error(`[Payment Proxy Error] ${routeName} - ${req.method} ${req.originalUrl}:`, err.message);
    if (!res.headersSent) {
      res.status(502).json({ 
        error: 'Bad Gateway', 
        message: `Service temporarily unavailable: ${err.message}`,
        route: routeName
      });
    }
  };
};


// Health check endpoints
router.use('/payment/health', createProxyMiddleware({
  target: PAYMENT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/payment/health': '/health' },
  on: {
    error: createErrorHandler('payment-health'),
    proxyReq: (proxyReq: any, req: any, res: any) => {
      console.log(`[Payment Proxy] Health check: ${req.method} ${req.originalUrl}`);
    }
  }
}));

router.use('/transaction-matching/health', createProxyMiddleware({
  target: TRANSACTION_MATCHING_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/transaction-matching/health': '/health' },
  on: {
    error: createErrorHandler('transaction-matching-health'),
    proxyReq: (proxyReq: any, req: any, res: any) => {
      console.log(`[Payment Proxy] Health check: ${req.method} ${req.originalUrl}`);
    }
  }
}));

// Payment service routes - Use PAYMENTS feature since PAYMENT_SERVICES doesn't exist
router.use(
  "/payment",
  jwtMw(Config["jwtSecret"], true),
  requireAuth,
  requireFeature(Feature.PAYMENTS),
  createProxyMiddleware({
    target: PAYMENT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/payment": "/payments" },
    on: {
      error: createErrorHandler('payment-service'),
      proxyReq: (proxyReq: any, req: any, res: any) => {
        console.log(`[Payment Proxy] Proxying ${req.method} ${req.originalUrl} to ${PAYMENT_SERVICE_URL}${proxyReq.path}`);
      },
      proxyRes: (proxyRes: any, req: any, res: any) => {
        console.log(`[Payment Proxy] Response from payment-service: ${proxyRes.statusCode}`);
      }
    }
  })
);

// Transaction matching service routes - Use PAYMENTS feature since TRANSACTION_MATCHING_SERVICES doesn't exist
router.use(
  "/transaction-matching",
  jwtMw(Config["jwtSecret"], true),
  requireAuth,
  requireFeature(Feature.PAYMENTS),
  createProxyMiddleware({
    target: TRANSACTION_MATCHING_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/transaction-matching": "/transaction-matching" },
    on: {
      error: createErrorHandler('transaction-matching-service'),
      proxyReq: (proxyReq: any, req: any, res: any) => {
        console.log(`[Payment Proxy] Proxying ${req.method} ${req.originalUrl} to ${TRANSACTION_MATCHING_SERVICE_URL}${proxyReq.path}`);
      },
      proxyRes: (proxyRes: any, req: any, res: any) => {
        console.log(`[Payment Proxy] Response from transaction-matching-service: ${proxyRes.statusCode}`);
      }
    }
  })
);

export default router;
