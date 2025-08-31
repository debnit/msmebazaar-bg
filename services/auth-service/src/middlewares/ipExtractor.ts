// services/auth-service/src/middlewares/ipExtractor.ts
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to extract the real IP address from the request
 * Handles various proxy scenarios and deployment environments
 */
export const extractClientIP = (req: Request, res: Response, next: NextFunction) => {
  // Extract IP from various headers in order of preference
  const clientIP = 
    req.headers['cf-connecting-ip'] || // Cloudflare
    req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || // Standard proxy header
    req.headers['x-real-ip'] || // Nginx proxy
    req.headers['x-client-ip'] || // Custom header
    req.socket.remoteAddress || // Direct connection
    req.socket?.remoteAddress || // Socket connection
    req.ip || // Express default
    'unknown';

  // Clean up the IP address
  const cleanIP = typeof clientIP === 'string' ? clientIP.replace(/^::ffff:/, '') : 'unknown';
  
  // Set the IP on the request object
  req.clientIP = cleanIP;
  
  next();
};

/**
 * Get client IP from request (utility function)
 */
export const getClientIP = (req: Request): string => {
  return req.clientIP || req.ip || 'unknown';
};

/**
 * Validate if an IP address is valid
 */
export const isValidIP = (ip: string): boolean => {
  if (!ip || ip === 'unknown') return false;
  
  // IPv4 regex
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  
  // IPv6 regex (simplified)
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

/**
 * Sanitize IP address for logging/storage
 */
export const sanitizeIP = (ip: string): string => {
  if (!ip || ip === 'unknown') return 'unknown';
  
  // Remove IPv6 prefix if present
  const cleanIP = ip.replace(/^::ffff:/, '');
  
  // Validate the IP
  return isValidIP(cleanIP) ? cleanIP : 'invalid';
};

/**
 * Get token from request headers
 */
export const getTokenFromRequest = (req: Request): string | null => {
  // Check Authorization header bearer token
  if (req.headers?.authorization?.startsWith("Bearer ")) {
    return req.headers.authorization.substring(7);
  }

  // Check cookie
  if (req.headers?.cookie) {
    const match = req.headers.cookie
      .split(";")
      .find((c: string) => c.trim().startsWith("session="));

    if (match) {
      return match.trim().split("=")[1];
    }
  }

  return null;
};

/**
 * Get token from request using shared session utilities
 */
export const getTokenFromRequestWithIP = (req: Request): { token: string | null; ip: string } => {
  const token = getTokenFromRequest(req);
  const ip = getClientIP(req);
  return { token, ip };
};
