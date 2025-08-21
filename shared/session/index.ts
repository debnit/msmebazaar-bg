// /shared/session/index.ts

import { SessionUser } from "../types/user";
import { Request } from "express";


export interface SessionOptions {
  cookieName?: string; // default: 'session'
  secure?: boolean;    // set true for https
  maxAge?: number;     // ms, default: 7d
  domain?: string;
  path?: string;
  sameSite?: boolean | 'lax' | 'strict' | 'none';
}


export function setSessionCookie(
  res: any, // Express Response or Next.js ServerResponse
  token: string,
  opts: SessionOptions = {}
) {
  const {
    cookieName = "session",
    secure = true,
    maxAge = 7 * 24 * 60 * 60 * 1000,
    domain,
    path = "/",
    sameSite = "lax"
  } = opts;

  const cookieVal =
    `${cookieName}=${token}; Path=${path}; Max-Age=${Math.floor(maxAge / 1000)}` +
    (secure ? "; Secure" : "") +
    "; HttpOnly" +
    (domain ? `; Domain=${domain}` : "") +
    (sameSite ? `; SameSite=${sameSite}` : "");

  res.setHeader("Set-Cookie", cookieVal);
}


export function getTokenFromRequest(
  req: Request | { cookies?: Record<string, string>; headers?: Record<string, string> },
  opts: SessionOptions = {}
): string | null {
  const { cookieName = "session" } = opts;

  // Check cookie parsing (typical Express or Next.js req)
  if (req.cookies?.[cookieName]) return req.cookies[cookieName];

  // Check Authorization header bearer token
  if (req.headers?.authorization?.startsWith("Bearer ")) {
    return req.headers.authorization.substring(7);
  }

  // Check raw cookie header
  if (req.headers?.cookie) {
    const match = req.headers.cookie
      .split(";")
      .find((c: string) => c.trim().startsWith(`${cookieName}=`));

    if (match) return match.trim().split("=")[1];
  }

  return null;
}


/**
 * Extracts typed SessionUser from request by decoding a verified JWT token.
 * Returns null if token is missing or invalid.
 */
import { verifyJwtToken } from "../auth";


export function getSessionUserFromRequest(
  req: Request | any,
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
