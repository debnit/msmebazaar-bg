"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJwtToken = createJwtToken;
exports.verifyJwtToken = verifyJwtToken;
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.getSessionUser = getSessionUser;
exports.jwtMw = jwtMw;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// JWT Sign
function createJwtToken(payload, secret, expiresIn = "1d", options = {}) {
    const signOptions = {
        ...options,
        expiresIn: expiresIn
    };
    return jsonwebtoken_1.default.sign(payload, secret, signOptions);
}
// JWT verification helper; returns typed payload or null on failure
function verifyJwtToken(token, secret) {
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch {
        return null;
    }
}
// Password hashing using bcrypt (consider argon2 for stronger security)
async function hashPassword(password, saltRounds = 12) {
    return bcryptjs_1.default.hash(password, saltRounds);
}
// Password verification
async function verifyPassword(password, hash) {
    return bcryptjs_1.default.compare(password, hash);
}
// Session user extracted from req
//export interface SessionUser extends BaseJwtClaims {
// Optionally include other session fields
//}
// Extracts SessionUser from Express Request or session, returns null if missing
function getSessionUser(req) {
    if (req.user?.id)
        return req.user;
    if (req.session?.user?.id)
        return req.session.user;
    return null;
}
// JWT Express middleware, usable in any Node/Express service, supports strict rejectOnInvalid
function jwtMw(secret, rejectOnInvalid = false) {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            if (rejectOnInvalid)
                return res.status(401).json({ error: "Authorization header missing or malformed" });
            return next();
        }
        const token = authHeader.split(" ")[1];
        const payload = verifyJwtToken(token, secret);
        if (!payload) {
            if (rejectOnInvalid)
                return res.status(401).json({ error: "Invalid or expired token" });
            return next();
        }
        req.user = payload;
        next();
    };
}
//# sourceMappingURL=index.js.map