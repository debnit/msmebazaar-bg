"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireFeature = requireFeature;
const featureAccess_1 = require("../../../api-gateway/src/utils/featureAccess");
const auth_1 = require("../../../shared/auth");
function requireFeature(feature) {
    return (req, res, next) => {
        const user = (0, auth_1.getSessionUser)(req);
        if (!user)
            return res.status(401).json({ error: "Authentication required" });
        const hasAccess = (0, featureAccess_1.canUserAccessFeature)(feature, {
            role: user.roles?.[0] || "",
            isPro: user.isPro || false,
            userId: user.id,
        });
        if (!hasAccess) {
            return res.status(403).json({ error: `Feature access to ${feature} denied` });
        }
        next();
    };
}
//# sourceMappingURL=featureGating.js.map