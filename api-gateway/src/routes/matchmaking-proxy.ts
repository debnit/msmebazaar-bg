import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const router: Router = Router();

router.use(
  '/matchmaking',
  createProxyMiddleware({
    target: 'http://matchmaking-service:4000', // Use internal service hostname:port
    changeOrigin: true,
    pathRewrite: { '^/api/matchmaking': '' },
    // Optionally: onProxyReq, onProxyRes hooks for logging/auth
  })
);

export default router;
