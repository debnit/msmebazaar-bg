import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";

// ===== JWT Section =====

export interface BaseJwtClaims {
  id: string;                // always userId
  roles: string[];           // could be string enums
  isPro?: boolean;
  [key: string]: any;        // custom claims (e.g. tenant, permissions)
}

// JWT creation
export function createJwtToken(
  payload: BaseJwtClaims, 
  secret: string, 
  expiresIn: string | number = "1d",
  options: Partial<SignOptions> = {}
): string {
  return jwt.sign(payload, secret, { expiresIn, ...options });
}

// JWT verification
export function verifyJwtToken<T extends BaseJwtClaims = BaseJwtClaims>(
  token: string, 
  secret: string
): T {
  return jwt.verify(token, secret) as T;
}

// ========================


// ===== Password Hashing Section =====

/**
 * Hash and salt a password for storage.
 * Uses bcrypt under the hood, can swap for argon2 if needed.
 */
export async function hashPassword(password: string, saltRounds = 12): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

/**
 * Validate a user's password against a stored hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ========================


// ===== Session/Context Utilities =====

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  isPro?: boolean;
  [key: string]: any;
}

/**
 * Extracts user/account info from req object 
 * (assuming JWT middleware writes req.user)
 */
export function getSessionUser(req: any): SessionUser | null {
  if (req?.user && req.user.id) {
    return req.user as SessionUser;
  }
  if (req?.session && req.session.user) {
    return req.session.user as SessionUser;
  }
  return null;
}

// Middleware for Express to attach user from JWT (for S2S use)
import { Request, Response, NextFunction } from "express";

/**
 * Optionally use as fallback JWT check inside any microservice (when bypassing api-gateway).
 * Usage: app.use(sharedAuth.jwtMw(secret))
 */
export function jwtMw(secret: string) {
  return function (req: Request & { user?: SessionUser }, res: Response, next: NextFunction) {
    const auth = req.headers["authorization"];
    if (auth && auth.startsWith("Bearer ")) {
      try {
        req.user = verifyJwtToken(auth.split(" ")[1], secret);
      } catch {
        // Leave user undefined, or optionally reject here
      }
    }
    next();
  };
}

// ========================

