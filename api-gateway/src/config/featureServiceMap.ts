  // api-gateway/src/config/featureServiceMap.ts
  import { Feature } from "@msmebazaar/types/feature";

  export const featureServiceMap: Record<string, Feature> = {
    /* -------- Authentication (no feature gating, public) -------- */
    // auth/...  ← not gated, handled via verifyJwt if private

    /* -------- User/Profile -------- */
    "user/profile": Feature.USER_PROFILE,
    "user/change-password": Feature.USER_PROFILE,
    "user/avatar": Feature.USER_PROFILE,

    /* -------- MSME: Business Profile -------- */
    "business/profile": Feature.BUSINESS_PROFILE,
    "business/documents": Feature.BUSINESS_PROFILE,
    "business/verify-gst": Feature.BUSINESS_PROFILE_VERIFY,

    /* -------- Payments & Pro Subscription -------- */
    "paymentservice/upgrade": Feature.PRO_UPGRADE,
    "paymentservice/verify-upgrade": Feature.PRO_UPGRADE,
    "paymentservice/orders": Feature.PAYMENTS,
    "paymentservice/transactions": Feature.PAYMENT_HISTORY,
    "paymentservice/invoices": Feature.PAYMENT_HISTORY,

    /* -------- Analytics -------- */
    "analytics/dashboard": Feature.ADVANCED_ANALYTICS,
    "analytics/business": Feature.ADVANCED_ANALYTICS,
    "analytics/payments": Feature.ADVANCED_ANALYTICS,

    /* -------- Marketplace -------- */
    "marketplace/products": Feature.B2B_MARKETPLACE,
    "marketplace/product": Feature.B2B_MARKETPLACE,
    "marketplace/search": Feature.B2B_MARKETPLACE,
    "marketplace/categories": Feature.B2B_MARKETPLACE,
    "marketplace/vendors": Feature.B2B_MARKETPLACE,
    "marketplace/vendor": Feature.B2B_MARKETPLACE,

    /* -------- Messaging -------- */
    "messaging/investor": Feature.MESSAGING,
    "messaging": Feature.MESSAGING,

    /* -------- Orders -------- */
    "orders": Feature.ORDERS_MANAGEMENT,

    /* -------- Loans -------- */
    "loans/applications": Feature.BUSINESS_LOANS,
    "loans/eligibility": Feature.BUSINESS_LOANS,
    "loans": Feature.BUSINESS_LOANS,

    /* -------- Valuation -------- */
    "valuation/calculate": Feature.AI_BUSINESS_VALUATION,

    /* -------- Compliance -------- */
    "compliance/checklist": Feature.COMPLIANCE_CHECKLIST,

    /* -------- Exit Strategy -------- */
    "eaasservice/programs": Feature.EXIT_STRATEGY,

    /* -------- Market Linkage / Matchmaking -------- */
    "matchmaking": Feature.MATCHMAKING,
    "recommendationservice": Feature.RECOMMENDATIONS,
    "searchmatchmakingservice": Feature.SEARCHMATCHMAKING,
    

    /* -------- CRM -------- */
    "crm/pipeline": Feature.CRM_PIPELINE,

    /* -------- Leadership Training -------- */
    "training/catalog": Feature.LEADERSHIP_TRAINING,

    /* -------- Deals -------- */
    "deals": Feature.DEALS_MARKETPLACE,

    /* -------- Admin / Superadmin -------- */
    "admin/features": Feature.ADMIN_FEATURE_TOGGLES,
    "admin/users": Feature.ADMIN_USER_MANAGEMENT,
    "superadmin/system-health": Feature.SUPERADMIN_MONITORING,
    "superadmin/database": Feature.SUPERADMIN_DATABASE_OPS
  };
