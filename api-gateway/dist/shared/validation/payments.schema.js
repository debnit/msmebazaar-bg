"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPaymentSchema = exports.createPaymentOrderSchema = void 0;
// /shared/validation/payments.schema.ts
const zod_1 = require("zod");
exports.createPaymentOrderSchema = zod_1.z.object({
    amount: zod_1.z.number().positive(),
    currency: zod_1.z.string().length(3).default("INR"),
    planId: zod_1.z.string().optional() // for subscription upgrades
});
exports.verifyPaymentSchema = zod_1.z.object({
    razorpayPaymentId: zod_1.z.string(),
    razorpayOrderId: zod_1.z.string(),
    razorpaySignature: zod_1.z.string()
});
//# sourceMappingURL=payments.schema.js.map