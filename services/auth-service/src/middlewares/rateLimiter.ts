import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

const createRateLimiter = (
  windowMs: number,
  max: number,
  errorMessage: string
) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request) => {
      return `${req.ip}-${req.body?.email || 'anonymous'}`;
    },
    handler: (req: Request, res: Response, next: NextFunction) => {
      res.status(429).json({
        success: false,
        error: errorMessage,
      });
    },
  });
};

export const authRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many authentication attempts, please try again after 15 minutes'
);

export const registerRateLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  3, // 3 attempts
  'Too many registration attempts, please try again after 1 hour'
);
