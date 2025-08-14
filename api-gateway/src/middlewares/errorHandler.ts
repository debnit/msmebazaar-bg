// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export function errorHandler(err: any, req: Request & { id?: string }, res: Response, _next: NextFunction) {
  const requestId = req.id || "N/A";
  logger.error({
    msg: "API Gateway error",
    requestId,
    method: req.method,
    url: req.originalUrl,
    status: err.status || 500,
    error: err.message,
    stack: err.stack
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    requestId
  });
}
