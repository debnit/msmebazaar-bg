//**✅ CTO Recommendation - Explicit Authentication Implementation:**


// PRODUCTION-GRADE AUTHENTICATION MIDDLEWARE
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { logger } from "../utils/logger";

export interface AuthenticatedUser {
  id: string;
  email: string;
  roles: string[];
  isPro: boolean;
  exp: number;
  iat: number;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      logger.warn('Authentication failed: No token provided', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path
      });
        res.status(401).json({ 
        error: "Authentication required",
        code: "MISSING_TOKEN"
      });
    }

    // Verify JWT with enhanced validation
    const decoded = jwt.verify(token, env.jwtSecret, {
      algorithms: ['HS256'], // Restrict algorithms
      issuer: env.jwtIssuer, // Validate issuer
      audience: env.jwtAudience, // Validate audience
      maxAge: '24h' // Maximum token age
    }) as AuthenticatedUser;

    // Additional security checks
    if (!decoded.id || !decoded.email) {
      throw new Error('Invalid token payload');
    }

    // Check token expiration with buffer
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      throw new Error('Token expired');
    }

    req.user = decoded;
    
    logger.info('Authentication successful', {
      userId: decoded.id,
      path: req.path,
      method: req.method
    });

    next();
  } catch (error) {
    logger.error('Authentication failed', {
      error: error.message,
      ip: req.ip,
      path: req.path
    });

    if (error.name === 'TokenExpiredError') {
        res.status(401).json({ 
        error: "Token expired",
        code: "TOKEN_EXPIRED"
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: "Invalid token",
        code: "INVALID_TOKEN"
      });
    }

    return res.status(401).json({ 
      error: "Authentication failed",
      code: "AUTH_ERROR"
    });
  }
};

// Optional middleware for enhanced security
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
       res.status(401).json({ error: "Authentication required" });
    }

    const userRoles = req.user.roles || [];
    const hasRole = allowedRoles.some(role => userRoles.includes(role));

    if (!hasRole) {
      logger.warn('Authorization failed: Insufficient role', {
        userId: req.user.id,
        userRoles,
        requiredRoles: allowedRoles,
        path: req.path
      });
      
      res.status(403).json({ 
        error: "Insufficient permissions",
        code: "INSUFFICIENT_ROLE"
      });
    }

    next();
  };
};
