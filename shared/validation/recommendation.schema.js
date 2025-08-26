"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendationRequestSchema = void 0;
const zod_1 = require("zod");
exports.recommendationRequestSchema = zod_1.z.object({
    filters: zod_1.z.record(zod_1.z.any()).optional(),
    limit: zod_1.z.number().int().min(1).max(20).optional()
});
//# sourceMappingURL=recommendation.schema.js.map