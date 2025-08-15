// /shared/session/index.ts

import type { SessionUser } from "@shared/auth";

export interface SessionOptions {
  cookieName?: string;           // default: 'session'
  secure?: boolean;              // set true for https
  maxAge?: number;               // ms, default: 7d
  domain?: string;
  path?: string;
  sameSite?: boolean | 'lax' | 'strict' | 'none';
}

export function setSessionCookie(
  res: any, // Express res or Next.js ServerResponse
  token: string,
  opts: SessionOptions = {}
) {
  const {
    cookieName = "session",
    secure = true,
    maxAge = 7 * 24 * 60 * 60 * 1000,
    domain, path = "/", sameSite = "lax"
  } = opts;
  const cookieVal = `${cookieName}=${token}; Path=${path}; Max-Age=${Math.floor(maxAge / 1000)}`
    + (secure ? "; Secure" : "")
    + `; HttpOnly`
    + (domain ? `; Domain=${domain}` : "")
    + (sameSite ? `; SameSite=${sameSite}` : "");
  res.setHeader("Set-Cookie", cookieVal);
}

/** Reads JWT from session cookie (or header fallback) in universal context */
export function getTokenFromRequest(req: any, opts: SessionOptions = {}): string | null {
  const { cookieName = "session" } = opts;
  // Node (Express/Next)
  if (req.cookies?.[cookieName]) return req.cookies[cookieName];
  // Fallback: header
  if (req.headers?.authorization?.startsWith("Bearer ")) {
    return req.headers.authorization.substring(7);
  }
  // Raw cookie header parsing fallback
  if (req.headers?.cookie) {
    const match = req.headers.cookie.split(";").find(c => c.trim().startsWith(`${cookieName}=`));
    if (match) return match.trim().split("=")[1];
  }
  return null;
}

/**
 * Extracts typed SessionUser (if JWT is valid) using shared/auth verifyJwtToken
 */
import { verifyJwtToken } from "@shared/auth";

export function getSessionUserFromRequest(
  req: any,
  secret: string,
  opts: SessionOptions = {}
): SessionUser | null {
  const token = getTokenFromRequest(req, opts);
  if (!token) return null;
  try {
    return verifyJwtToken<SessionUser>(token, secret);
  } catch {
    return null;
  }
}
