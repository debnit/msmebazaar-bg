import { SessionUser } from "../types/user";
import { Request } from "express";
export interface SessionOptions {
    cookieName?: string;
    secure?: boolean;
    maxAge?: number;
    domain?: string;
    path?: string;
    sameSite?: boolean | 'lax' | 'strict' | 'none';
}
export declare function setSessionCookie(res: any, // Express Response or Next.js ServerResponse
token: string, opts?: SessionOptions): void;
export declare function getTokenFromRequest(req: Request | {
    cookies?: Record<string, string>;
    headers?: Record<string, string>;
}, opts?: SessionOptions): string | null;
export declare function getSessionUserFromRequest(req: Request | any, secret: string, opts?: SessionOptions): SessionUser | null;
