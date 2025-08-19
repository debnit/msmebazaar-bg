"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.limiter = void 0;
// src/middlewares/rateLimiter.ts
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // default 15 min
    max: parseInt(process.env.RATE_LIMIT_MAX || "1000", 10),
    message: { success: false, message: "Too many requests from this IP" }
});
//# sourceMappingURL=rateLimiter.js.map