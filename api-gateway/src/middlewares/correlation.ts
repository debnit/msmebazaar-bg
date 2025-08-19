import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

export function correlationId(req: Request & { id?: string }, res: Response, next: NextFunction) {
  const requestId = req.header("X-Request-ID") || uuidv4();
  req.id = requestId;
  req.headers["X-Request-ID"] = requestId;
  res.setHeader("X-Request-ID", requestId);
  next();
}
