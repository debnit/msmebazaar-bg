"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServiceProxy = createServiceProxy;
// src/services/proxyFactory.ts
const http_proxy_middleware_1 = require("http-proxy-middleware");
const circuitBreaker_1 = require("./circuitBreaker");
const logger_1 = require("../utils/logger");
function createServiceProxy(serviceName, target) {
    const proxy = (0, http_proxy_middleware_1.createProxyMiddleware)({
        target,
        changeOrigin: true,
        pathRewrite: path => path.replace(new RegExp(`^/api/${serviceName}`), ""),
        onProxyReq: (proxyReq, req) => {
            // Forward correlation ID to downstream services
            if (req.id)
                proxyReq.setHeader("X-Request-ID", req.id);
        },
        onError: (err, req, res) => {
            logger_1.logger.error({ msg: "Proxy error", serviceName, error: err.message, requestId: req.id });
            res.status(502).json({ success: false, message: "Bad Gateway", requestId: req.id });
        }
    });
    return (0, circuitBreaker_1.createCircuitBreaker)((req, res) => new Promise((resolve, reject) => {
        proxy(req, res, err => (err ? reject(err) : resolve(null)));
    }));
}
//# sourceMappingURL=proxyFactory.js.map