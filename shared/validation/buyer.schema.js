"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyerSchema = void 0;
const zod_1 = require("zod");
exports.buyerSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    preference: zod_1.z.record(zod_1.z.any())
});
//# sourceMappingURL=buyer.schema.js.map