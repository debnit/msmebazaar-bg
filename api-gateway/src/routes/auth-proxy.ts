import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { requireAuth } from "../middlewares/auth";
import { requireFeature } from "../middlewares/requireFeature";
import { jwtMw } from "@msmebazaar/shared/auth";
import { Config } from "../config";
import { Feature } from "@msmebazaar/types/feature";
import { createServiceProxy } from '../services/proxyFactory';

const router: Router = Router();

// Get auth service URL from environment or use default
const rawAuthUrl = process.env.AUTH_SERVICE_URL || "http://127.0.0.1:8004";
const AUTH_SERVICE_URL = rawAuthUrl.trim().replace(/\/+$/, "");
console.log('[Auth Proxy] Using normalized AUTH_SERVICE_URL:', AUTH_SERVICE_URL);


console.log('[Auth Proxy] Using AUTH_SERVICE_URL:', AUTH_SERVICE_URL);

// Logging middleware
router.use((req, res, next) => {
  console.log(`[Auth Proxy] Received: ${req.method} ${req.originalUrl}`);
  next();
});

router.use('/login', createServiceProxy('auth', AUTH_SERVICE_URL));


// Common error handler for proxy middleware
const createErrorHandler = (routeName: string) => {
  return (err: any, req: any, res: any) => {
    console.error(`[Auth Proxy Error] ${routeName} - ${req.method} ${req.originalUrl}:`, err.message);
    if (!res.headersSent) {
      res.status(502).json({
        error: 'Bad Gateway',
        message: `Service temporarily unavailable: ${err.message}`,
        route: routeName,
      });
    }
  };
};

// Common proxy configuration helper
const createProxyConfig = (pathRewrite: Record<string, string>, routeName: string) => ({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite,
  on: {
    error: createErrorHandler(routeName),
    proxyReq: (proxyReq: any, req: any, res: any) => {
      console.log(`[Auth Proxy] Proxying ${req.method} ${req.originalUrl} to ${AUTH_SERVICE_URL}${proxyReq.path}`);
    },
    proxyRes: (proxyRes: any, req: any, res: any) => {
      console.log(`[Auth Proxy] Response from ${routeName}: ${proxyRes.statusCode}`);
    }
  }
});

// Public routes (no authentication)
router.use('/register', createProxyMiddleware(
  createProxyConfig({ '^/register': '/auth/register' }, 'register')
));

router.use('/login', createProxyMiddleware(
  createProxyConfig({ '^/login': '/auth/login' }, 'login')
));

router.use('/refresh', createProxyMiddleware(
  createProxyConfig({ '^/refresh': '/auth/refresh' }, 'refresh')
));

router.use('/logout', createProxyMiddleware(
  createProxyConfig({ '^/logout': '/auth/logout' }, 'logout')
));

router.use('/verify-email', createProxyMiddleware(
  createProxyConfig({ '^/verify-email': '/auth/verify-email' }, 'verify-email')
));

// Protected routes (require JWT)
router.use('/profile',
  jwtMw(Config["jwtSecret"], true),
  createProxyMiddleware(
    createProxyConfig({ '^/profile': '/auth/profile' }, 'profile')
  )
);

router.use('/upgrade-pro',
  jwtMw(Config["jwtSecret"], true),
  createProxyMiddleware(
    createProxyConfig({ '^/upgrade-pro': '/auth/upgrade-pro' }, 'upgrade-pro')
  )
);

router.use('/change-password',
  jwtMw(Config["jwtSecret"], true),
  createProxyMiddleware(
    createProxyConfig({ '^/change-password': '/auth/change-password' }, 'change-password')
  )
);

// Session management routes (require JWT)
router.use('/sessions',
  jwtMw(Config["jwtSecret"], true),
  createProxyMiddleware(
    createProxyConfig({ '^/sessions': '/auth/sessions' }, 'sessions')
  )
);

// Admin routes (require JWT + role-based access)
router.use('/add-role',
  jwtMw(Config["jwtSecret"], true),
  requireAuth,
  createProxyMiddleware(
    createProxyConfig({ '^/add-role': '/auth/add-role' }, 'add-role')
  )
);

router.use('/remove-role',
  jwtMw(Config["jwtSecret"], true),
  requireAuth,
  createProxyMiddleware(
    createProxyConfig({ '^/remove-role': '/auth/remove-role' }, 'remove-role')
  )
);

// Health check endpoint
router.use('/health', createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/health': '/health' },
  on: {
    error: createErrorHandler('health'),
    proxyReq: (proxyReq: any, req: any, res: any) => {
      console.log(`[Auth Proxy] Health check: ${req.method} ${req.originalUrl}`);
    }
  }
}));

// Catch-all for unmatched auth routes
router.use((req, res) => {
  console.warn(`[Auth Proxy] No route matched: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Not Found',
    message: `Auth route not found: ${req.originalUrl}`,
    availableRoutes: [
      '/register', '/login', '/refresh', '/logout', '/verify-email',
      '/profile', '/upgrade-pro', '/change-password', '/sessions',
      '/add-role', '/remove-role', '/health'
    ]
  });
});

export default router;
