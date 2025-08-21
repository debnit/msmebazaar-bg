"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_proxy_middleware_1 = require("http-proxy-middleware");
const router = (0, express_1.Router)();
router.use('/matchmaking', (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: 'http://matchmaking-service:4000', // Use internal service hostname:port
    changeOrigin: true,
    pathRewrite: { '^/api/matchmaking': '' },
    // Optionally: onProxyReq, onProxyRes hooks for logging/auth
}));
exports.default = router;
//# sourceMappingURL=matchmaking-proxy.js.map