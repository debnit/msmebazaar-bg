"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchmakingRequestSchema = void 0;
const zod_1 = require("zod");
exports.matchmakingRequestSchema = zod_1.z.object({
    buyerId: zod_1.z.string().uuid(),
    sellerId: zod_1.z.string().uuid(),
    score: zod_1.z.number().min(0).max(1).optional()
});
//# sourceMappingURL=matchmaking.schema.js.map