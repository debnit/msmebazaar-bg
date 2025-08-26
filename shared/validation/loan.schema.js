"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loanApplicationSchema = exports.loanCtaSchema = void 0;
// /shared/validation/loan.schema.ts
const zod_1 = require("zod");
exports.loanCtaSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    loanAmount: zod_1.z.number().positive(),
    purpose: zod_1.z.string().min(5),
    tenureMonths: zod_1.z.number().int().positive()
});
exports.loanApplicationSchema = exports.loanCtaSchema.extend({
    documents: zod_1.z.array(zod_1.z.string().url()).optional()
});
//# sourceMappingURL=loan.schema.js.map