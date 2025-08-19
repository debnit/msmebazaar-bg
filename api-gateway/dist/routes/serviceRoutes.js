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
function createServiceProxyRoute(serviceName, serviceUrl, authRequired = true) {
    const proxyBreaker = (0, proxyFactory_1.createServiceProxy)(serviceName, serviceUrl);
    const featureGate = (req, res, next) => {
        const key = `${serviceName}${req.path}`.replace(/^\/+/, "").toLowerCase();
        const feature = featureServiceMap_1.featureServiceMap[key];
        if (feature) {
            return (0, requireFeature_1.requireFeature)(feature)(req, res, next);
        }
        next();
    };
    const chain = [
        correlation_1.correlationId,
        logger_1.logRequests,
        rateLimiter_1.limiter,
        ...(authRequired ? [auth_1.verifyJwt] : []),
        featureGate,
        (req, res, next) => proxyBreaker.fire(req, res).catch(next)
    ];
    router.use(`/${serviceName}`, ...chain);
}
createServiceProxyRoute("auth", services_1.servicesConfig.auth, false);
Object.entries(services_1.servicesConfig)
    .filter(([name]) => name !== "auth")
    .forEach(([name, url]) => createServiceProxyRoute(name, url, true));
exports.default = router;
//# sourceMappingURL=serviceRoutes.js.map