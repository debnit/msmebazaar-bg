"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const index_1 = require("@shared/auth/index");
function requireAuth(req, res, next) {
    const user = (0, index_1.getSessionUser)(req);
    if (!user || !user.id) {
        return res.status(401).json({ success: false, message: "Authentication required" });
    }
    next();
}
//# sourceMappingURL=auth.js.map