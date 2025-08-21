"use strict";
// /shared/session/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSessionCookie = setSessionCookie;
exports.getTokenFromRequest = getTokenFromRequest;
exports.getSessionUserFromRequest = getSessionUserFromRequest;
function setSessionCookie(res, // Express Response or Next.js ServerResponse
token, opts = {}) {
    const { cookieName = "session", secure = true, maxAge = 7 * 24 * 60 * 60 * 1000, domain, path = "/", sameSite = "lax" } = opts;
    const cookieVal = `${cookieName}=${token}; Path=${path}; Max-Age=${Math.floor(maxAge / 1000)}` +
        (secure ? "; Secure" : "") +
        "; HttpOnly" +
        (domain ? `; Domain=${domain}` : "") +
        (sameSite ? `; SameSite=${sameSite}` : "");
    res.setHeader("Set-Cookie", cookieVal);
}
function getTokenFromRequest(req, opts = {}) {
    const { cookieName = "session" } = opts;
    // Check cookie parsing (typical Express or Next.js req)
    if (req.cookies?.[cookieName])
        return req.cookies[cookieName];
    // Check Authorization header bearer token
    if (req.headers?.authorization?.startsWith("Bearer ")) {
        return req.headers.authorization.substring(7);
    }
    // Check raw cookie header
    if (req.headers?.cookie) {
        const match = req.headers.cookie
            .split(";")
            .find((c) => c.trim().startsWith(`${cookieName}=`));
        if (match)
            return match.trim().split("=")[1];
    }
    return null;
}
/**
 * Extracts typed SessionUser from request by decoding a verified JWT token.
 * Returns null if token is missing or invalid.
 */
const auth_1 = require("../auth");
function getSessionUserFromRequest(req, secret, opts = {}) {
    const token = getTokenFromRequest(req, opts);
    if (!token)
        return null;
    try {
        return (0, auth_1.verifyJwtToken)(token, secret);
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=index.js.map