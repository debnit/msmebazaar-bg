// src/middlewares/auditLogger.ts

import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

/**
 * Audit Logger middleware
 * Logs minimal but essential info for every incoming request:
 * - HTTP method, URL, protocol version
 * - Request headers (excluding sensitive info)
 * - IP address
 * - User agent
 * - Unique request ID (from headers or generated)
 * 
 * Extend this middleware for integration with external audit logging
 * or compliance systems as needed.
 */
export function auditLogger(req: Request, res: Response, next: NextFunction): void {
  try {
    const requestId = req.headers["x-request-id"] || "<no-request-id>";
    const ip = req.ip || req.socket.remoteAddress || "<unknown-ip>";
    const userAgent = req.headers["user-agent"] || "<unknown-user-agent>";

    // Log request start
    logger.info("Audit Log - Incoming Request", {
      requestId,
      method: req.method,
      url: req.originalUrl,
      protocol: req.protocol,
      httpVersion: req.httpVersion,
      ip,
      userAgent,
      // You might want to whitelist some headers if needed:
      // headers: sanitizeHeaders(req.headers),
    });

    // Optionally, you may also listen to the response finish event here
    // to log response status and time taken.

  } catch (error: any) {
    // Should never throw; log error then continue request flow
    logger.error("Audit Logger failed", { error: error.message });
  } finally {
    next();
  }
}
