"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireFeature = void 0;
const featureAccess_1 = require("../utils/featureAccess");
const requireFeature = (feature) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }
        if (!(0, featureAccess_1.canUserAccessFeature)(feature, {
            role: req.user.role,
            isPro: req.user.isPro,
            userId: req.user.id
        })) {
            return res.status(403).json({
                success: false,
                message: `Feature "${feature}" not enabled or access denied`
            });
        }
        next();
    };
};
exports.requireFeature = requireFeature;
//# sourceMappingURL=requireFeature.js.map