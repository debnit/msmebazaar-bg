import { Feature } from "../../shared/config/featureFlagTypes";

/**
 * This map links API-Gateway route patterns → Feature keys.
 * Keys follow the format: `${serviceName}/${relativePath}` (no leading slash).
 *
 * The relative path should match the path AFTER `/api/{serviceName}`
 * in your frontend `api.*` calls.
 *
 * Example:
 *  Frontend: api.analytics.getDashboard() → /api/analytics/dashboard
 *  Map key: "analytics/dashboard" : Feature.ADVANCED_ANALYTICS
 */

export const featureServiceMap: Record<string, Feature> = {
  /* ================================
   * Analytics Module
   * ================================ */
  "analytics/dashboard": Feature.ADVANCED_ANALYTICS,
  "analytics/business": Feature.ADVANCED_ANALYTICS,
  "analytics/payments": Feature.ADVANCED_ANALYTICS,

  /* ================================
   * Reports Module
   * ================================ */
  "reports/custom": Feature.CUSTOM_REPORTS,

  /* ================================
   * Payments / Pro Subscription
   * ================================ */
  "paymentservice/upgrade": Feature.PRO_UPGRADE,
  "paymentservice/verify-upgrade": Feature.PRO_UPGRADE,
  "paymentservice/orders": Feature.PRO_UPGRADE,
  "paymentservice/transactions": Feature.PAYMENT_HISTORY,
  "paymentservice/invoices": Feature.PAYMENT_HISTORY,

  /* ================================
   * Valuation Service
   * ================================ */
  "valuation/calculate": Feature.AI_BUSINESS_VALUATION,

  /* ================================
   * Compliance Module
   * ================================ */
  "compliance/checklist": Feature.COMPLIANCE_CHECKLIST,

  /* ================================
   * Exit Strategy Module
   * ================================ */
  "eaasservice/programs": Feature.EXIT_STRATEGY,

  /* ================================
   * Market Linkage
   * ================================ */
  "matchmaking": Feature.MARKET_LINKAGE,
  "recommendationservice": Feature.MARKET_LINKAGE,
  "searchmatchmakingservice": Feature.MARKET_LINKAGE,
  "sellerservice": Feature.MARKET_LINKAGE,
  "msmelistingservice": Feature.MARKET_LINKAGE,

  /* ================================
   * Loans & Finance
   * ================================ */
  "loanservice/applications": Feature.BUSINESS_LOANS,
  "loanservice/eligibility": Feature.BUSINESS_LOANS,
  "loanservice/status": Feature.BUSINESS_LOANS,

  /* ================================
   * CRM
   * ================================ */
  "crm/pipeline": Feature.CRM_PIPELINE,

  /* ================================
   * Training
   * ================================ */
  "training/catalog": Feature.LEADERSHIP_TRAINING,

  /* ================================
   * Gamification
   * ================================ */
  "gamificationservice": Feature.GAMIFICATION,

  /* ================================
   * MSME Networking
   * ================================ */
  "networking": Feature.MSME_NETWORKING,

  /* ================================
   * Seller/B2B Marketplace
   * ================================ */
  "marketplace/products": Feature.B2B_MARKETPLACE,
  "marketplace/vendors": Feature.B2B_MARKETPLACE,
  "marketplace/search": Feature.B2B_MARKETPLACE,
  "marketplace/categories": Feature.B2B_MARKETPLACE,

  /* ================================
   * Messaging
   * ================================ */
  "messaging/investor": Feature.MESSAGING,
  "messaging": Feature.MESSAGING,

  /* ================================
   * Orders
   * ================================ */
  "orders": Feature.ORDERS_MANAGEMENT,

  /* ================================
   * Deals & Matchmaking
   * ================================ */
  "deals": Feature.DEALS_MARKETPLACE,

  /* ================================
   * Admin / SuperAdmin features
   * ================================ */
  "admin/features": Feature.ADMIN_FEATURE_TOGGLES,
  "admin/users": Feature.ADMIN_USER_MANAGEMENT,
  "superadmin/system-health": Feature.SUPERADMIN_MONITORING,
  "superadmin/database": Feature.SUPERADMIN_DATABASE_OPS
};
