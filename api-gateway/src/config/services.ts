interface ServiceConfig {
  url: string;
  requiresAuth: boolean;
}

export const servicesConfig: Record<string, ServiceConfig> = {
  analytics: { url: process.env["ANALYTICS_SERVICE_URL"] || "http://localhost:8000", requiresAuth: true },
  marketplace: { url: process.env["MARKETPLACE_SERVICE_URL"] || "http://localhost:8001", requiresAuth: true },
  payments: { url: process.env["PAYMENTS_SERVICE_URL"] || "http://localhost:8002", requiresAuth: true },
  user: { url: process.env["USER_SERVICE_URL"] || "http://localhost:8003", requiresAuth: true },
  auth: { url: process.env["AUTH_SERVICE_URL"] || "http://localhost:8004", requiresAuth: false },
  msme: { url: process.env["MSME_SERVICE_URL"] || "http://localhost:8005", requiresAuth: true },
  valuation: { url: process.env["VALUATION_SERVICE_URL"] || "http://localhost:8006", requiresAuth: true },
  matchmaking: { url: process.env["MATCHMAKING_SERVICE_URL"] || "http://localhost:8007", requiresAuth: true },
  notification: { url: process.env["NOTIFICATION_SERVICE_URL"] || "http://localhost:8008", requiresAuth: true },
  admin: { url: process.env["ADMIN_SERVICE_URL"] || "http://localhost:8009", requiresAuth: true },
  compliance: { url: process.env["COMPLIANCE_SERVICE_URL"] || "http://localhost:8010", requiresAuth: true },
  eaasservice: { url: process.env["EAAS_SERVICE_URL"] || "http://localhost:8011", requiresAuth: true },
  gamificationservice: { url: process.env["GAMIFICATION_SERVICE_URL"] || "http://localhost:8012", requiresAuth: true },
  loanservice: { url: process.env["LOAN_SERVICE_URL"] || "http://localhost:8013", requiresAuth: true },
  mlmonitoringservice: { url: process.env["ML_MONITORING_SERVICE_URL"] || "http://localhost:8014", requiresAuth: true },
  msmelistingservice: { url: process.env["MSME_LISTING_SERVICE_URL"] || "http://localhost:8015", requiresAuth: true },
  nbfcservice: { url: process.env["NBFC_SERVICE_URL"] || "http://localhost:8016", requiresAuth: true },
  paymentservice: { url: process.env["PAYMENT_SERVICE_URL"] || "http://localhost:8017", requiresAuth: true },
  recommendationservice: { url: process.env["RECOMMENDATION_SERVICE_URL"] || "http://localhost:8018", requiresAuth: true },
  searchmatchmakingservice: { url: process.env["SEARCH_MATCHMAKING_SERVICE_URL"] || "http://localhost:8019", requiresAuth: true },
  sellerservice: { url: process.env["SELLER_SERVICE_URL"] || "http://localhost:8020", requiresAuth: true },
  transactionmatchingservice: { url: process.env["TRANSACTION_MATCHING_SERVICE_URL"] || "http://localhost:8021", requiresAuth: true },
  userprofileservice: { url: process.env["USER_PROFILE_SERVICE_URL"] || "http://localhost:8022", requiresAuth: true },
  buyer: { url: process.env["BUYER_SERVICE_URL"] || "http://localhost:8023", requiresAuth: true },
  seller: { url: process.env["SELLER_SERVICE_URL"] || "http://localhost:8024", requiresAuth: true },
  superadmin: { url: process.env["SUPERADMIN_SERVICE_URL"] || "http://localhost:8025", requiresAuth: true },
  investor: { url: process.env["INVESTOR_SERVICE_URL"] || "http://localhost:8026", requiresAuth: true },
  agent: { url: process.env["AGENT_SERVICE_URL"] || "http://localhost:8027", requiresAuth: true },
  loan: { url: process.env["LOAN_SERVICE_URL"] || "http://localhost:8028", requiresAuth: true },
  payment: { url: process.env["PAYMENT_SERVICE_URL"] || "http://localhost:8029", requiresAuth: true }
} as const;


export type ServiceName = keyof typeof servicesConfig;
