// services/auth-service/src/index.ts
import express from 'express';
import cors from 'cors';
import { Config } from './config/env';
import { logger } from './utils/logger';
import { securityMiddleware } from './middlewares/security';
import { errorHandler, notFoundHandler } from '@msmebazaar/shared/middleware/errorHandler';
import { authRateLimiter, registerRateLimiter, generalRateLimiter } from './middlewares/rateLimiter';
import { GracefulShutdown } from './utils/gracefulShutdown';
import { extractClientIP } from './middlewares/ipExtractor';
import authRoutes from './routes/auth.routes';
import healthRoutes from './routes/health.routes';
import { SessionService } from './services/session.service';
//import {errorHandler} from "../middlewares/errorHandler";
const app = express();

// Security middleware
app.use(securityMiddleware);

// CORS configuration
app.use(cors({
  origin: Config.CORS_ORIGIN === 'http://localhost:3000' ? true : Config.CORS_ORIGIN.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// IP extraction middleware (apply early)
app.use(extractClientIP);

// Request ID middleware
app.use((req, res, next) => {
  req.id = Math.random().toString(36).substr(2, 9);
  res.setHeader('X-Request-ID', req.id);
  next();
});

// General rate limiting
app.use(generalRateLimiter);

// Routes
app.use('/health', healthRoutes);
// Auth routes (handles public and protected internally)
app.use('/auth', authRoutes);

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

// Cleanup expired sessions every hour
setInterval(async () => {
  try {
    const deletedCount = await SessionService.cleanupExpiredSessions();
    if (deletedCount > 0) {
      logger.info(`Cleaned up ${deletedCount} expired sessions`);
    }
  } catch (error) {
    logger.error('Failed to cleanup expired sessions', { error });
  }
}, 60 * 60 * 1000); // 1 hour

// Log session stats on startup
setTimeout(async () => {
  try {
    const stats = await SessionService.getSessionStats();
    logger.info('Session statistics', stats);
  } catch (error) {
    logger.error('Failed to get session stats', { error });
  }
}, 5000); // 5 seconds after startup
