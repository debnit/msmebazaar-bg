import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";

export type UserRole = "buyer" | "seller" | "agent" | "investor" | "msmeowner" | "founder" | "admin" | "superadmin";

export interface BaseJwtClaims {
  id: string;                // userId
  roles: UserRole[];         // enum
  isPro?: boolean;
  email?: string;
  name?: string;
  onboardedProAt?: string;   // e.g. ISO date for ₹99 onboarding
  [key: string]: any;
}

// JWT Sign
export function createJwtToken(
  payload: BaseJwtClaims,
  secret: string,
  expiresIn: string | number = "1d",
  options: Partial<SignOptions> = {}
): string {
  return jwt.sign(payload, secret, { expiresIn, ...options });
}

// JWT Verify (returns null if invalid)
export function verifyJwtToken<T extends BaseJwtClaims = BaseJwtClaims>(
  token: string,
  secret: string
): T | null {
  try {
    return jwt.verify(token, secret) as T;
  } catch {
    return null;
  }
}

// Password hashing & verification (can switch argon2 if wanted)
export async function hashPassword(password: string, saltRounds = 12): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Session user extracted from req
export interface SessionUser extends BaseJwtClaims {
  // Optionally include other session fields
}

// Extract user from request
export function getSessionUser(req: any): SessionUser | null {
  if (req?.user && req.user.id) return req.user as SessionUser;
  if (req?.session && req.session.user && req.session.user.id) return req.session.user as SessionUser;
  return null;
}

// JWT Express middleware, usable in any Node/Express service, supports strict rejectOnInvalid
export function jwtMw(secret: string, rejectOnInvalid = false) {
  return (req: Request & { user?: SessionUser }, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      if (rejectOnInvalid) return res.status(401).json({ error: "Authorization header missing or malformed" });
      return next();
    }
    const token = authHeader.split(" ")[1];
    const payload = verifyJwtToken(token, secret);
    if (!payload) {
      if (rejectOnInvalid) return res.status(401).json({ error: "Invalid or expired token" });
      return next();
    }
    req.user = payload;
    next();
  };
}
