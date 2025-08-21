import { Request, Response, NextFunction } from "express";
import { getSessionUser } from "@shared/auth/index";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = getSessionUser(req);
  if (!user || !user.id) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }
  next();
}
