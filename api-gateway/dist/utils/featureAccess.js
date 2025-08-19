"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.canUserAccessFeature = void 0;
const featureFlags_json_1 = __importDefault(require("../../shared/config/featureFlags.json"));
const canUserAccessFeature = (feature, ctx) => {
    const f = featureFlags_json_1.default[feature];
    if (!f?.enabled)
        return false;
    if (f.proOnly && !ctx.isPro && !(f.rolesEnabled || []).includes(ctx.role))
        return false;
    if (typeof f.rolloutPercentage === "number" && f.rolloutPercentage < 100) {
        const hash = Math.abs(hashString(ctx.userId + feature)) % 100;
        if (hash >= f.rolloutPercentage)
            return false;
    }
    return true;
};
exports.canUserAccessFeature = canUserAccessFeature;
const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++)
        hash = (hash << 5) - hash + str.charCodeAt(i);
    return hash;
};
//# sourceMappingURL=featureAccess.js.map