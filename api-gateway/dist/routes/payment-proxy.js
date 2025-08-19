"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// api-gateway/src/routes/payment-proxy.ts
const express_1 = require("express");
const http_proxy_middleware_1 = require("http-proxy-middleware");
const auth_1 = require("../middlewares/auth");
const featureFlagTypes_1 = require("../../shared/config/featureFlagTypes");
const router = (0, express_1.Router)();
// Apply auth and feature gating before proxying requests to payment service
router.use("/payments", auth_1.requireAuth, (0, auth_1.requireFeature)(featureFlagTypes_1.Feature.PAYMENTS), // Gates entire payments API to allowed users
(0, http_proxy_middleware_1.createProxyMiddleware)({
    target: process.env.PAYMENT_SERVICE_URL || "http://localhost:4004",
    changeOrigin: true,
    pathRewrite: { "^/payments": "" },
}));
exports.default = router;
//# sourceMappingURL=payment-proxy.js.map