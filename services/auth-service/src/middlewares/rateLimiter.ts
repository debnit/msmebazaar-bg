import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { getClientIP, sanitizeIP } from './ipExtractor';

const createRateLimiter = (
  windowMs: number,
  max: number,
  errorMessage: string,
  keyGenerator?: (req: Request) => string
) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: keyGenerator || ((req: Request) => {
      const clientIP = getClientIP(req);
      const sanitizedIP = sanitizeIP(clientIP);
      const email = req.body?.email || 'anonymous';
      return `${sanitizedIP}-${email}`;
    }),
    handler: (req: Request, res: Response, next: NextFunction) => {
      const clientIP = getClientIP(req);
      console.log(`Rate limit exceeded for IP: ${clientIP}, Email: ${req.body?.email || 'anonymous'}`);
      
      res.status(429).json({
        success: false,
        error: errorMessage,
        retryAfter: Math.ceil(windowMs / 1000), // seconds
      });
    },
    skip: (req: Request) => {
      // Skip rate limiting for health checks
      return req.path === '/health' || req.path === '/health/';
    },
  });
};

export const authRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many authentication attempts, please try again after 15 minutes',
  (req: Request) => {
    const clientIP = getClientIP(req);
    const sanitizedIP = sanitizeIP(clientIP);
    const email = req.body?.email || 'anonymous';
    return `auth-${sanitizedIP}-${email}`;
  }
);

export const registerRateLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  5, // 3 attempts
  'Too many registration attempts, please try again after 1 hour',
  (req: Request) => {
    const clientIP = getClientIP(req);
    const sanitizedIP = sanitizeIP(clientIP);
    const email = req.body?.email || 'anonymous';
    return `register-${sanitizedIP}-${email}`;
  }
);

export const refreshTokenRateLimiter = createRateLimiter(
  5 * 60 * 1000, // 5 minutes
  100, // 10 attempts
  'Too many token refresh attempts, please try again after 5 minutes',
  (req: Request) => {
    const clientIP = getClientIP(req);
    const sanitizedIP = sanitizeIP(clientIP);
    return `refresh-${sanitizedIP}`;
  }
);

export const generalRateLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  100, // 100 requests per minute
  'Too many requests, please try again later',
  (req: Request) => {
    const clientIP = getClientIP(req);
    const sanitizedIP = sanitizeIP(clientIP);
    return `general-${sanitizedIP}`;
  }
);
