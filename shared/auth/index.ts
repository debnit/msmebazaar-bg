import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types/feature";
import { SessionUser } from "../types/user";

//export type UserRole = "buyer" | "seller" | "agent" | "investor" | "msmeowner" | "founder" | "admin" | "superadmin";

// Base JWT claims interface with required and optional fields
export interface BaseJwtClaims {
  id: string;
  email: string;
  name: string;
  isPro?: boolean;
  onboardedProAt?: string;
  roles: UserRole[];
  createdAt: string;
  updatedAt: string;
}


// JWT Sign
export function createJwtToken(
  payload: BaseJwtClaims,
  secret: string,
  expiresIn: string | number = "1d",
  options: Partial<SignOptions> = {}
): string {
  const signOptions: SignOptions = { 
  ...options, 
  expiresIn: expiresIn as any
  };
  return jwt.sign(payload, secret,signOptions );
}

// JWT verification helper; returns typed payload or null on failure
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


// Password hashing using bcrypt (consider argon2 for stronger security)
export async function hashPassword(password: string, saltRounds = 12): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

// Password verification
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}


// Session user extracted from req
//export interface SessionUser extends BaseJwtClaims {
  // Optionally include other session fields
//}


// Extracts SessionUser from Express Request or session, returns null if missing
export function getSessionUser(req: Request): SessionUser | null {
  if (req.user?.id) return req.user as SessionUser;
  if (req.session?.user?.id) return req.session.user;
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
