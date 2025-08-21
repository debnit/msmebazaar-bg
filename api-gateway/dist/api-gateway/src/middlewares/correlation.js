"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.correlationId = correlationId;
const uuid_1 = require("uuid");
function correlationId(req, res, next) {
    const requestId = req.header("X-Request-ID") || (0, uuid_1.v4)();
    req.id = requestId;
    req.headers["X-Request-ID"] = requestId;
    res.setHeader("X-Request-ID", requestId);
    next();
}
//# sourceMappingURL=correlation.js.map