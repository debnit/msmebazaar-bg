"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const logger_1 = require("../utils/logger");
function errorHandler(err, req, res, _next) {
    const requestId = req.id || "N/A";
    logger_1.logger.error({
        msg: "API Gateway error",
        requestId,
        method: req.method,
        url: req.originalUrl,
        status: err.status || 500,
        error: err.message,
        stack: err.stack
    });
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        requestId
    });
}
//# sourceMappingURL=errorHandler.js.map