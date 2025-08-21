"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentStatusSchema = exports.createPaymentSchema = void 0;
const zod_1 = require("zod");
exports.createPaymentSchema = zod_1.z.object({
    orderId: zod_1.z.string().optional(),
    amount: zod_1.z.number().positive(),
    currency: zod_1.z.string().default("INR"),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.updatePaymentStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["initiated", "pending", "completed", "failed", "refunded", "cancelled"]),
    gatewayRef: zod_1.z.string().optional(),
});
//# sourceMappingURL=payment.schema.js.map