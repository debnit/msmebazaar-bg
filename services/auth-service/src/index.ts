// services/auth-service/src/index.ts
import express from 'express';
import cors from 'cors';
import { Config } from './config/env';
import { logger } from './utils/logger';
import { securityMiddleware } from './middlewares/security';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { authRateLimiter, registerRateLimiter } from './middlewares/rateLimiter';
import { GracefulShutdown } from './utils/gracefulShutdown';
import authRoutes from './routes/auth.routes';
import healthRoutes from './routes/health.routes';

const app = express();

// Security middleware
app.use(securityMiddleware);

// CORS configuration
app.use(cors({
  origin: Config.CORS_ORIGIN === '*' ? true : Config.CORS_ORIGIN.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request ID middleware
app.use((req, res, next) => {
  req.id = Math.random().toString(36).substr(2, 9);
  res.setHeader('X-Request-ID', req.id);
  next();
});

// Routes
app.use('/health', healthRoutes);
app.use('/auth/register', registerRateLimiter);
app.use('/auth', authRateLimiter, authRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

const server = app.listen(Config.PORT, () => {
  logger.info(`Auth service running on port ${Config.PORT}`, {
    environment: Config.NODE_ENV,
    nodeVersion: process.version
  });
});

// Setup graceful shutdown
new GracefulShutdown(server);
