"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
// src/config/index.ts
const env_1 = require("./env");
const services_1 = require("./services");
exports.Config = {
    port: env_1.env.PORT,
    jwtSecret: env_1.env.JWT_SECRET,
    frontendUrl: env_1.env.FRONTEND_URL,
    nodeEnv: env_1.env.NODE_ENV,
    logLevel: env_1.env.LOG_LEVEL,
    services: services_1.servicesConfig
};
//# sourceMappingURL=index.js.map