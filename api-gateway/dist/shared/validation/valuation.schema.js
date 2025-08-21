"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.valuationRequestSchema = void 0;
// /shared/validation/valuation.schema.ts
const zod_1 = require("zod");
exports.valuationRequestSchema = zod_1.z.object({
    businessId: zod_1.z.string().uuid(),
    metrics: zod_1.z.object({
        turnover: zod_1.z.number().positive({ message: "Turnover must be positive" }),
        profitMargin: zod_1.z.number().min(0).max(1),
        growthRate: zod_1.z.number().optional(),
        industry: zod_1.z.string().optional(),
        employees: zod_1.z.number().int().nonnegative().optional()
    })
});
//# sourceMappingURL=valuation.schema.js.map