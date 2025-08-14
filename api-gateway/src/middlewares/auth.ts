// src/middlewares/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Config } from "../config";

export interface AuthenticatedUser {
  id: string;
  role: string;
  isPro?: boolean;
  [key: string]: any;
}

export function verifyJwt(req: Request & { user?: AuthenticatedUser }, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Missing token" });
  }
  try {
    const payload = jwt.verify(token, Config.jwtSecret) as AuthenticatedUser;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}
