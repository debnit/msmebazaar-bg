// api-gateway/src/utils/logger.ts
import pino from "pino";
import { Request, Response, NextFunction } from "express";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  base: undefined,
  timestamp: pino.stdTimeFunctions.isoTime
});

/** Middleware for timing request/response */
export function logRequests(req: Request, res: Response, next: NextFunction) {

  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info({
      reqId: (req as any).id,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      user: req.user ? { id: req.user.id, role: req.user.role } : null
    });
  });
  next();
}
