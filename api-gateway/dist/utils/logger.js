"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.logRequests = logRequests;
// api-gateway/src/utils/logger.ts
const pino_1 = __importDefault(require("pino"));
exports.logger = (0, pino_1.default)({
    level: process.env.LOG_LEVEL || "info",
    base: undefined,
    timestamp: pino_1.default.stdTimeFunctions.isoTime
});
/** Middleware for timing request/response */
function logRequests(req, res, next) {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        exports.logger.info({
            reqId: req.id,
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            user: req.user ? { id: req.user.id, role: req.user.role } : null
        });
    });
    next();
}
//# sourceMappingURL=logger.js.map