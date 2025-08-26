"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mlJobEventSchema = void 0;
const zod_1 = require("zod");
exports.mlJobEventSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    service: zod_1.z.string(),
    status: zod_1.z.string(), // e.g. "completed", "failed"
    metrics: zod_1.z.record(zod_1.z.any()),
    startedAt: zod_1.z.string().optional(),
    endedAt: zod_1.z.string().optional()
});
//# sourceMappingURL=mlMonitoring.schema.js.map