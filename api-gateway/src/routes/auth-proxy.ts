// api-gateway/src/routes/auth-proxy.ts
import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { requireAuth } from "../middlewares/auth";
import { requireFeature } from "../middlewares/requireFeature";
import { jwtMw } from "@msmebazaar/shared/auth";
import { Config } from "../config";
import {errorHandler} from "../middlewares/errorHandler"
import { Feature } from "@msmebazaar/types/feature";

const router: Router = Router();

router.use((req, res, next) => {
  console.log(`[Auth Proxy] Received: ${req.method} ${req.originalUrl}`);
  next();
});

/*const registerProxy = createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL || 'http://localhost:8004',
  changeOrigin: true,
  pathRewrite: { '^/register': '/auth/register' },
});

// Attach error handler to catch proxy errors and log them
registerProxy.('error', (err:any, req:any, res:any) => {
  console.error(`[Proxy Error] ${req.method} ${req.originalUrl}:`, err.message);
  if (!res.headersSent) {
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Bad Gateway', message: err.message }));
  }
});

router.use('/register', registerProxy);*/

console.log('[Proxy Setup] Using AUTH_SERVICE_URL:', process.env.AUTH_SERVICE_URL);

// Public auth routes - no authentication required
 router.use(
  "/register",
  createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL || 'http://localhost:8004',
  changeOrigin: true,
  pathRewrite: { '^/register': '/auth/register' },
  
 })

);


router.use(
  "/login",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || "http://localhost:8004",
    changeOrigin: true,
    pathRewrite: { "^/login": "/auth/login" },
  })
);

router.use(
  "/refresh",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || "http://localhost:8004",
    changeOrigin: true,
    pathRewrite: { "^/refresh": "/auth/refresh" },
  })
);

router.use(
  "/logout",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || "http://localhost:8004",
    changeOrigin: true,
    pathRewrite: { "^/logout": "/auth/logout" },
  })
);

// Protected auth routes that require authentication
router.use(
  "/profile",
  jwtMw(Config["jwtSecret"], true),  // Apply JWT middleware for protected routes
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || "http://localhost:8004",
    changeOrigin: true,
    pathRewrite: { "^/profile": "/auth/profile" },
  })
);

router.use(
  "/upgrade-pro",
  jwtMw(Config["jwtSecret"], true),
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || "http://localhost:8004",
    changeOrigin: true,
    pathRewrite: { "^/upgrade-pro": "/auth/upgrade-pro" },
  })
);

// Admin routes with role-based access
router.use(
  "/add-role",
  jwtMw(Config["jwtSecret"], true),
  requireAuth,
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || "http://localhost:8004",
    changeOrigin: true,
    pathRewrite: { "^/add-role": "/auth/add-role" },
  })
);

router.use(
  "/remove-role",
  jwtMw(Config["jwtSecret"], true),
  requireAuth,
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || "http://localhost:8004",
    changeOrigin: true,
    pathRewrite: { "^/remove-role": "/auth/remove-role" },
  })
);


export default router;
