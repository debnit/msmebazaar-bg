"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.featureServiceMap = void 0;
// api-gateway/src/config/featureServiceMap.ts
const featureFlagTypes_1 = require("@shared/config/featureFlagTypes");
exports.featureServiceMap = {
    /* -------- Authentication (no feature gating, public) -------- */
    // auth/...  ← not gated, handled via verifyJwt if private
    /* -------- User/Profile -------- */
    "user/profile": featureFlagTypes_1.Feature.USER_PROFILE,
    "user/change-password": featureFlagTypes_1.Feature.USER_PROFILE,
    "user/avatar": featureFlagTypes_1.Feature.USER_PROFILE,
    /* -------- MSME: Business Profile -------- */
    "business/profile": featureFlagTypes_1.Feature.BUSINESS_PROFILE,
    "business/documents": featureFlagTypes_1.Feature.BUSINESS_PROFILE,
    "business/verify-gst": featureFlagTypes_1.Feature.BUSINESS_PROFILE_VERIFY,
    /* -------- Payments & Pro Subscription -------- */
    "paymentservice/upgrade": featureFlagTypes_1.Feature.PRO_UPGRADE,
    "paymentservice/verify-upgrade": featureFlagTypes_1.Feature.PRO_UPGRADE,
    "paymentservice/orders": featureFlagTypes_1.Feature.PAYMENTS,
    "paymentservice/transactions": featureFlagTypes_1.Feature.PAYMENT_HISTORY,
    "paymentservice/invoices": featureFlagTypes_1.Feature.PAYMENT_HISTORY,
    /* -------- Analytics -------- */
    "analytics/dashboard": featureFlagTypes_1.Feature.ADVANCED_ANALYTICS,
    "analytics/business": featureFlagTypes_1.Feature.ADVANCED_ANALYTICS,
    "analytics/payments": featureFlagTypes_1.Feature.ADVANCED_ANALYTICS,
    /* -------- Marketplace -------- */
    "marketplace/products": featureFlagTypes_1.Feature.B2B_MARKETPLACE,
    "marketplace/product": featureFlagTypes_1.Feature.B2B_MARKETPLACE,
    "marketplace/search": featureFlagTypes_1.Feature.B2B_MARKETPLACE,
    "marketplace/categories": featureFlagTypes_1.Feature.B2B_MARKETPLACE,
    "marketplace/vendors": featureFlagTypes_1.Feature.B2B_MARKETPLACE,
    "marketplace/vendor": featureFlagTypes_1.Feature.B2B_MARKETPLACE,
    /* -------- Messaging -------- */
    "messaging/investor": featureFlagTypes_1.Feature.MESSAGING,
    "messaging": featureFlagTypes_1.Feature.MESSAGING,
    /* -------- Orders -------- */
    "orders": featureFlagTypes_1.Feature.ORDERS_MANAGEMENT,
    /* -------- Loans -------- */
    "loans/applications": featureFlagTypes_1.Feature.BUSINESS_LOANS,
    "loans/eligibility": featureFlagTypes_1.Feature.BUSINESS_LOANS,
    "loans": featureFlagTypes_1.Feature.BUSINESS_LOANS,
    /* -------- Valuation -------- */
    "valuation/calculate": featureFlagTypes_1.Feature.AI_BUSINESS_VALUATION,
    /* -------- Compliance -------- */
    "compliance/checklist": featureFlagTypes_1.Feature.COMPLIANCE_CHECKLIST,
    /* -------- Exit Strategy -------- */
    "eaasservice/programs": featureFlagTypes_1.Feature.EXIT_STRATEGY,
    /* -------- Market Linkage / Matchmaking -------- */
    "matchmaking": featureFlagTypes_1.Feature.MATCHMAKING,
    "recommendationservice": featureFlagTypes_1.Feature.RECOMMENDATIONS,
    "searchmatchmakingservice": featureFlagTypes_1.Feature.SEARCHMATCHMAKING,
    /* -------- CRM -------- */
    "crm/pipeline": featureFlagTypes_1.Feature.CRM_PIPELINE,
    /* -------- Leadership Training -------- */
    "training/catalog": featureFlagTypes_1.Feature.LEADERSHIP_TRAINING,
    /* -------- Deals -------- */
    "deals": featureFlagTypes_1.Feature.DEALS_MARKETPLACE,
    /* -------- Admin / Superadmin -------- */
    "admin/features": featureFlagTypes_1.Feature.ADMIN_FEATURE_TOGGLES,
    "admin/users": featureFlagTypes_1.Feature.ADMIN_USER_MANAGEMENT,
    "superadmin/system-health": featureFlagTypes_1.Feature.SUPERADMIN_MONITORING,
    "superadmin/database": featureFlagTypes_1.Feature.SUPERADMIN_DATABASE_OPS
};
//# sourceMappingURL=featureServiceMap.js.map