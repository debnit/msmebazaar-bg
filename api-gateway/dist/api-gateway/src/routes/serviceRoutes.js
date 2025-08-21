"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const correlation_1 = require("../middlewares/correlation");
const rateLimiter_1 = require("../middlewares/rateLimiter");
const logger_1 = require("../utils/logger");
const requireFeature_1 = require("../middlewares/requireFeature");
const proxyFactory_1 = require("../services/proxyFactory");
const services_1 = require("../config/services");
const featureServiceMap_1 = require("../config/featureServiceMap");
const router = (0, express_1.Router)();
const createFeatureGate = (serviceName) => {
    return (req, res, next) => {
        // Construct feature map key
        const key = `${serviceName}${req.path}`.toLowerCase();
        console.log("[Feature Gate] Computed key:", key);
        const feature = featureServiceMap_1.featureServiceMap[key];
        console.log("[Feature Gate] Matched feature:", feature);
        if (feature) {
            return (0, requireFeature_1.requireFeature)(feature)(req, res, next);
        }
        next();
    };
};
function createServiceProxyRoute(serviceName, serviceConfig) {
    const proxyBreaker = (0, proxyFactory_1.createServiceProxy)(serviceName, serviceConfig.url);
    const middlewareChain = [
        correlation_1.correlationId,
        logger_1.logRequests,
        rateLimiter_1.limiter,
        ...(serviceConfig.requiresAuth ? [auth_1.requireAuth] : []),
        createFeatureGate(serviceName),
        (req, res, next) => {
            proxyBreaker(req, res).catch(next);
        }
    ];
    router.use(`/${serviceName}`, ...middlewareChain);
}
Object.entries(services_1.servicesConfig).forEach(([name, config]) => {
    createServiceProxyRoute(name, config);
});
exports.default = router;
//# sourceMappingURL=serviceRoutes.js.map