"use strict";
// src/middlewares/requireFeature.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireFeature = void 0;
const featureAccess_1 = require("../utils/featureAccess");
/**
 * Middleware factory to enforce access to a specific feature.
 * Checks that a logged-in user has permission to use the given feature.
 */
const requireFeature = (feature) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }
        const user = req.user;
        // Check access using your shared feature access utility
        const hasAccess = (0, featureAccess_1.canUserAccessFeature)(feature, {
            role: user.role,
            isPro: user.isPro,
            userId: user.id,
        });
        if (!hasAccess) {
            return res.status(403).json({
                success: false,
                message: `Feature "${feature}" not enabled or access denied`,
            });
        }
        next();
    };
};
exports.requireFeature = requireFeature;
//# sourceMappingURL=requireFeature.js.map