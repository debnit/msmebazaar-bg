"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
exports.requireAdmin = requireAdmin;
const auth_1 = require("../auth");
const types_1 = require("../types");
//const JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret_for_unit_tests";
function requireRole(...allowedRoles) {
    return (req, res, next) => {
        const user = (0, auth_1.getSessionUser)(req);
        if (!user?.roles) {
            return res.status(401).json({ error: "Authentication required" });
        }
        const hasRole = user.roles.some(role => allowedRoles.includes(role));
        if (!hasRole) {
            return res.status(403).json({ error: "Insufficient permissions" });
        }
        next();
    };
}
function requireAdmin(req, res, next) {
    const user = (0, auth_1.getSessionUser)(req);
    if (!user ||
        !user.roles.some(role => role === types_1.UserRole.ADMIN || role === types_1.UserRole.SUPER_ADMIN)) {
        return res.status(403).json({ error: "Admin access required" });
    }
    next();
}
//# sourceMappingURL=auth.js.map