"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.servicesConfig = void 0;
// List of microservice URLs, loaded from env or config
exports.servicesConfig = {
    auth: process.env.AUTH_SERVICE_URL || "http://auth-service:4001",
    analytics: process.env.ANALYTICS_SERVICE_URL || "http://analytics-service:4002",
    marketplace: process.env.MARKETPLACE_SERVICE_URL || "http://marketplace-service:4003",
    payments: process.env.PAYMENTS_SERVICE_URL || "http://payments-service:4004",
    user: process.env.USER_SERVICE_URL || "http://user-service:4005",
    auth: process.env.AUTH_SERVICE_URL || "http://localhost:8000",
    msme: process.env.MSME_SERVICE_URL || "http://localhost:8002",
    valuation: process.env.VALUATION_SERVICE_URL || "http://localhost:8003",
    matchmaking: process.env.MATCHMAKING_SERVICE_URL || "http://localhost:8004",
    notification: process.env.NOTIFICATION_SERVICE_URL || "http://localhost:8006",
    admin: process.env.ADMIN_SERVICE_URL || "http://localhost:8005",
    compliance: process.env.COMPLIANCE_SERVICE_URL || "http://localhost:8010",
    eaasservice: process.env.EAAS_SERVICE_URL || "http://localhost:8011",
    gamificationservice: process.env.GAMIFICATION_SERVICE_URL || "http://localhost:8012",
    loanservice: process.env.LOAN_SERVICE_URL || "http://localhost:8013",
    mlmonitoringservice: process.env.ML_MONITORING_SERVICE_URL || "http://localhost:8014",
    msmelistingservice: process.env.MSME_LISTING_SERVICE_URL || "http://localhost:8015",
    nbfcservice: process.env.NBFC_SERVICE_URL || "http://localhost:8016",
    paymentservice: process.env.PAYMENT_SERVICE_URL || "http://localhost:8017",
    recommendationservice: process.env.RECOMMENDATION_SERVICE_URL || "http://localhost:8018",
    searchmatchmakingservice: process.env.SEARCH_MATCHMAKING_SERVICE_URL || "http://localhost:8019",
    sellerservice: process.env.SELLER_SERVICE_URL || "http://localhost:8020",
    transactionmatchingservice: process.env.TRANSACTION_MATCHING_SERVICE_URL || "http://localhost:8021",
    userprofileservice: process.env.USER_PROFILE_SERVICE_URL || "http://localhost:8022"
};
//# sourceMappingURL=services.js.map