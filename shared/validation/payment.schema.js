"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentSchema = void 0;
const zod_1 = require("zod");
exports.paymentSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    orderId: zod_1.z.string().uuid(),
    status: zod_1.z.string(),
    amount: zod_1.z.number().positive(),
    currency: zod_1.z.string().min(3).max(3)
});
//# sourceMappingURL=payment.schema.js.map