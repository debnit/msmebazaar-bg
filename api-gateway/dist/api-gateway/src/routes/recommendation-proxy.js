"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_proxy_middleware_1 = require("http-proxy-middleware");
const router = (0, express_1.Router)();
router.use("/recommendations", (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: "http://recommendation-service:4000",
    changeOrigin: true,
    pathRewrite: { "^/api/recommendations": "" },
}));
exports.default = router;
//# sourceMappingURL=recommendation-proxy.js.map