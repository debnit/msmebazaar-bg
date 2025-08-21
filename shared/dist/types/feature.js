"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessLevel = exports.UserRole = exports.Feature = void 0;
// /shared/types/feature.ts
var Feature;
(function (Feature) {
    Feature["ADVANCED_ANALYTICS"] = "ADVANCED_ANALYTICS";
    Feature["CUSTOM_REPORTS"] = "CUSTOM_REPORTS";
    Feature["PRIORITY_SUPPORT"] = "PRIORITY_SUPPORT";
    Feature["PRO_UPGRADE"] = "PRO_UPGRADE";
    Feature["PAYMENTS"] = "PAYMENTS";
    Feature["PAYMENT_HISTORY"] = "PAYMENT_HISTORY";
    Feature["AI_BUSINESS_VALUATION"] = "AI_BUSINESS_VALUATION";
    Feature["COMPLIANCE_CHECKLIST"] = "COMPLIANCE_CHECKLIST";
    Feature["EXIT_STRATEGY"] = "EXIT_STRATEGY";
    Feature["MARKET_LINKAGE"] = "MARKET_LINKAGE";
    Feature["BUSINESS_LOANS"] = "BUSINESS_LOANS";
    Feature["CRM_PIPELINE"] = "CRM_PIPELINE";
    Feature["LEADERSHIP_TRAINING"] = "LEADERSHIP_TRAINING";
    Feature["DEALS_MARKETPLACE"] = "DEALS_MARKETPLACE";
    Feature["ADMIN_FEATURE_TOGGLES"] = "ADMIN_FEATURE_TOGGLES";
    Feature["ADMIN_USER_MANAGEMENT"] = "ADMIN_USER_MANAGEMENT";
    Feature["SUPERADMIN_MONITORING"] = "SUPERADMIN_MONITORING";
    Feature["SUPERADMIN_DATABASE_OPS"] = "SUPERADMIN_DATABASE_OPS";
    Feature["USER_PROFILE"] = "USER_PROFILE";
    Feature["BUSINESS_PROFILE"] = "BUSINESS_PROFILE";
    Feature["BUSINESS_PROFILE_VERIFY"] = "BUSINESS_PROFILE_VERIFY";
    Feature["MSME_NETWORKING"] = "MSME_NETWORKING";
    Feature["B2B_MARKETPLACE"] = "B2B_MARKETPLACE";
    Feature["MESSAGING"] = "MESSAGING";
    Feature["ORDERS_MANAGEMENT"] = "ORDERS_MANAGEMENT";
    Feature["RECOMMENDATIONS"] = "RECOMMENDATIONS";
    Feature["MATCHMAKING"] = "MATCHMAKING";
    Feature["SEARCHMSME"] = "SEARCHMSME";
})(Feature || (exports.Feature = Feature = {}));
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["SUPER_ADMIN"] = "super_admin";
    UserRole["MSME_OWNER"] = "msmeOwner";
    UserRole["SELLER"] = "seller";
    UserRole["BUYER"] = "buyer";
    UserRole["AGENT"] = "agent";
    UserRole["INVESTOR"] = "investor";
    UserRole["DEVELOPER"] = "developer";
})(UserRole || (exports.UserRole = UserRole = {}));
var AccessLevel;
(function (AccessLevel) {
    AccessLevel["READ"] = "READ";
    AccessLevel["WRITE"] = "WRITE";
    AccessLevel["ADMIN"] = "ADMIN";
})(AccessLevel || (exports.AccessLevel = AccessLevel = {}));
//# sourceMappingURL=feature.js.map