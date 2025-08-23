//CTO-style recommendation for enhanced payment.routes.ts
import express, { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { 
  createRazorpayOrderController,
  verifyPaymentController,
  getPaymentStatusController,
  initiateRefundController,
  getRefundStatusController,
  getTransactionHistoryController,
  getPaymentAnalyticsController,
  razorpayWebhookController,
  healthCheckController,
} from "../controllers/payment.controller";
import { authenticateToken, requireRole } from "../middlewares/auth";
import { requireFeature } from "../middlewares/featureGating";
import { Feature } from "../featureAccess";
import { validateRequest } from "../validations/payment.schema";
import { auditLogger } from "../middlewares/auditLogger";
import { logger } from "../utils/logger";
import { env } from "../config/env";

const router = express.Router();

// ===== SECURITY MIDDLEWARE =====

router.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "checkout.razorpay.com", "*.razorpay.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "checkout.razorpay.com"],
      imgSrc: ["'self'", "data:", "https:", "*.razorpay.com"],
      connectSrc: ["'self'", "api.razorpay.com", "*.razorpay.com"],
      frameSrc: ["'self'", "api.razorpay.com", "checkout.razorpay.com"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow Razorpay embeds
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

router.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = env.allowedOrigins?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://checkout.razorpay.com',
    ];
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      logger.warn('CORS rejection', { origin, allowedOrigins });
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'X-Correlation-ID',
    'X-API-Key',
  ],
  exposedHeaders: ['X-Correlation-ID', 'X-Rate-Limit-Remaining'],
  credentials: true,
  maxAge: 86400, // 24 hours preflight cache
}));

router.use(compression({
  filter: (req, res) => {
    // Don't compress webhook endpoints
    if (req.path.includes('/webhook')) return false;
    return compression.filter(req, res);
  },
  level: 6, // Balanced compression
  threshold: 1024, // Only compress responses > 1KB
}));

// ===== RATE LIMITING CONFIGURATIONS =====

const strictLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: (req) => {
    // Different limits based on user type
    if (req.user?.roles?.includes('admin')) return 100;
    if (req.user?.roles?.includes('merchant')) return 50;
    return 10; // Regular users
  },
  message: (req) => ({
    error: "Too many payment requests, please try again later",
    code: "RATE_LIMIT_EXCEEDED",
    retryAfter: 60,
    limit: req.rateLimit?.limit,
    remaining: req.rateLimit?.remaining,
  }),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Rate limit by user ID for authenticated requests
    return req.user?.id || req.ip;
  },
});

const moderateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: (req) => {
    if (req.user?.roles?.includes('admin')) return 200;
    if (req.user?.roles?.includes('merchant')) return 100;
    return 30;
  },
  message: {
    error: "Too many requests, please slow down",
    code: "RATE_LIMIT_EXCEEDED"
  },
  keyGenerator: (req) => req.user?.id || req.ip,
});

const webhookLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1000, // High volume for webhooks
  message: "Webhook rate limit exceeded",
  skip: (req: Request) => {
    // Skip rate limiting for trusted webhook sources
    const trustedIPs = env.razorpayWebhookIPs?.split(',') || [];
    return trustedIPs.length > 0 && trustedIPs.includes(req.ip);
  },
  keyGenerator: (req) => `webhook:${req.ip}`,
});

// ===== MIDDLEWARE UTILITIES =====

/**
 * Webhook source validation middleware
 */
const validateWebhookSource = (req: Request, res: Response, next: NextFunction) => {
  const trustedIPs = env.razorpayWebhookIPs?.split(',') || [];
  const userAgent = req.get('User-Agent') || '';
  
  // In development, allow all sources
  if (env.nodeEnv === 'development') {
    return next();
  }

  // Validate IP if configured
  if (trustedIPs.length > 0 && !trustedIPs.includes(req.ip)) {
    logger.warn('Webhook request from untrusted IP', { 
      ip: req.ip,
      userAgent,
      path: req.path,
    });
    
    return res.status(403).json({ 
      error: "Forbidden: Untrusted webhook source",
      code: "WEBHOOK_SOURCE_BLOCKED",
    });
  }

  // Validate User-Agent pattern (basic check)
  if (userAgent && !userAgent.toLowerCase().includes('razorpay')) {
    logger.warn('Webhook request with suspicious User-Agent', {
      ip: req.ip,
      userAgent,
      path: req.path,
    });
  }
  
  next();
};

/**
 * Request correlation middleware
 */
const addCorrelationId = (req: Request, res: Response, next: NextFunction) => {
  const correlationId = req.get('X-Correlation-ID') || 
                       req.get('X-Request-ID') || 
                       crypto.randomUUID();
  
  req.correlationId = correlationId;
  res.set('X-Correlation-ID', correlationId);
  
  next();
};

/**
 * Request timing middleware
 */
const requestTiming = (req: Request, res: Response, next: NextFunction) => {
  req.startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    
    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      correlationId: req.correlationId,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    });

    // Set performance header
    res.set('X-Response-Time', `${duration}ms`);
  });
  
  next();
};

// ===== APPLY GLOBAL MIDDLEWARE =====

router.use(addCorrelationId);
router.use(requestTiming);

// ===== PAYMENT PROCESSING ENDPOINTS =====

/**
 * Create Payment Order
 * POST /payments/create-order
 */
router.post(
  "/create-order",
  strictLimiter,
  authenticateToken,
  requireFeature(Feature.PAYMENT_PROCESSING),
  validateRequest('createOrder'),
  auditLogger.logPaymentAttempt,
  createRazorpayOrderController
);

/**
 * Verify Payment Signature
 * POST /payments/verify-payment
 */
router.post(
  "/verify-payment",
  strictLimiter,
  authenticateToken,
  requireFeature(Feature.PAYMENT_PROCESSING),
  validateRequest('verifyPayment'),
  auditLogger.logPaymentVerification,
  verifyPaymentController
);

/**
 * Get Payment Status
 * GET /payments/status/:paymentId
 */
router.get(
  "/status/:paymentId",
  moderateLimiter,
  authenticateToken,
  requireFeature(Feature.PAYMENT_PROCESSING),
  validateRequest('getPaymentStatus'),
  getPaymentStatusController
);

// ===== REFUND MANAGEMENT ENDPOINTS =====

/**
 * Initiate Refund
 * POST /payments/refund
 */
router.post(
  "/refund",
  strictLimiter,
  authenticateToken,
  requireFeature(Feature.REFUND_PROCESSING),
  validateRequest('initiateRefund'),
  auditLogger.logRefundAttempt,
  initiateRefundController
);

/**
 * Get Refund Status  
 * GET /payments/refund/status/:refundId
 */
router.get(
  "/refund/status/:refundId",
  moderateLimiter,
  authenticateToken,
  requireFeature(Feature.REFUND_PROCESSING),
  validateRequest('getRefundStatus'),
  getRefundStatusController
);

// ===== TRANSACTION HISTORY & ANALYTICS =====

/**
 * Get Transaction History
 * GET /payments/transactions
 */
router.get(
  "/transactions",
  moderateLimiter,
  authenticateToken,
  requireFeature(Feature.PAYMENT_PROCESSING),
  validateRequest('getTransactions'),
  getTransactionHistoryController
);

/**
 * Get Payment Analytics (Admin/Merchant only)
 * GET /payments/analytics/summary
 */
router.get(
  "/analytics/summary",
  moderateLimiter,
  authenticateToken,
  requireRole(['admin', 'merchant']),
  requireFeature(Feature.PAYMENT_ANALYTICS),
  validateRequest('getAnalytics'),
  getPaymentAnalyticsController
);

// ===== WEBHOOK ENDPOINTS =====

/**
 * Razorpay Webhook Handler
 * POST /payments/webhook/razorpay
 */
router.post(
  "/webhook/razorpay",
  webhookLimiter,
  express.raw({ type: "application/json", limit: '10mb' }),
  validateWebhookSource,
  auditLogger.logWebhookReceived,
  razorpayWebhookController
);

// ===== HEALTH & MONITORING ENDPOINTS =====

/**
 * Payment Service Health Check
 * GET /payments/health
 */
router.get("/health", healthCheckController);

/**
 * Payment Service Readiness Check
 * GET /payments/ready
 */
router.get("/ready", async (req: Request, res: Response) => {
  try {
    // Perform comprehensive readiness checks
    const checks = await Promise.allSettled([
      // Database connectivity
      prisma.$queryRaw`SELECT 1`,
      // Kafka producer health
      getProducerHealth(),
      // Razorpay API connectivity (simple test)
      fetch('https://api.razorpay.com/', { 
        method: 'HEAD',
        timeout: 5000 
      }),
    ]);

    const dbHealthy = checks[0].status === 'fulfilled';
    const kafkaHealthy = checks[1].status === 'fulfilled' && checks[1].value;
    const razorpayHealthy = checks[2].status === 'fulfilled';

    const allHealthy = dbHealthy && kafkaHealthy && razorpayHealthy;

    res.status(allHealthy ? 200 : 503).json({
      status: allHealthy ? "ready" : "not ready",
      service: "payment-service",
      timestamp: new Date().toISOString(),
      checks: {
        database: dbHealthy ? "healthy" : "unhealthy",
        kafka: kafkaHealthy ? "healthy" : "unhealthy", 
        razorpay: razorpayHealthy ? "healthy" : "unhealthy",
      },
    });
  } catch (error) {
    logger.error('Readiness check failed', { error: error.message });
    res.status(503).json({
      status: "not ready",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Payment Service Metrics
 * GET /payments/metrics (Admin only)
 */
router.get(
  "/metrics",
  authenticateToken,
  requireRole(['admin']),
  async (req: Request, res: Response) => {
    try {
      const metrics = {
        producer: getProducerMetrics(),
        consumer: getConsumerMetrics(),
        service: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          version: process.env.npm_package_version || '1.0.0',
        },
      };

      res.json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Metrics collection failed', { error: error.message });
      res.status(500).json({
        success: false,
        error: 'Failed to collect metrics',
      });
    }
  }
);

// ===== ERROR HANDLING MIDDLEWARE =====

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const correlationId = req.correlationId || 'unknown';
  const duration = req.startTime ? Date.now() - req.startTime : 0;

  logger.error('Payment route error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    correlationId,
    duration,
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: "Request validation failed",
      code: "VALIDATION_ERROR",
      correlationId,
    });
  }

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      error: "CORS policy violation",
      code: "CORS_ERROR",
      correlationId,
    });
  }

  if (err.name === 'PayloadTooLargeError') {
    return res.status(413).json({
      success: false,
      error: "Request payload too large",
      code: "PAYLOAD_TOO_LARGE",
      correlationId,
    });
  }

  // Generic error response
  const isDevelopment = env.nodeEnv === 'development';
  
  res.status(500).json({
    success: false,
    error: "Internal server error",
    code: "PAYMENT_ROUTE_ERROR",
    correlationId,
    ...(isDevelopment && {
      details: err.message,
      stack: err.stack,
    }),
  });
});

// ===== 404 HANDLER =====

router.use('*', (req: Request, res: Response) => {
  const correlationId = req.correlationId || 'unknown';
  
  logger.warn('Payment route not found', {
    path: req.originalUrl,
    method: req.method,
    correlationId,
    ip: req.ip,
  });

  res.status(404).json({
    success: false,
    error: "Payment endpoint not found",
    code: "ENDPOINT_NOT_FOUND",
    path: req.originalUrl,
    method: req.method,
    correlationId,
  });
});

export default router;