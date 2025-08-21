"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionMatchSchema = void 0;
const zod_1 = require("zod");
exports.transactionMatchSchema = zod_1.z.object({
    transaction1: zod_1.z.string().uuid(),
    transaction2: zod_1.z.string().uuid(),
    score: zod_1.z.number().min(0).max(1)
});
//# sourceMappingURL=transactionMatching.schema.js.map