import { NextFunction, Request, Response } from "express";
import { PaymentError } from "../utils/errors";
import { logger } from "../utils/logger";


export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error("API error", { error: err.message, stack: err.stack });

  if (err instanceof PaymentError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  res.status(500).json({ success: false, message: "Internal server error" });
}
