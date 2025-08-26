"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRequestSchema = void 0;
const zod_1 = require("zod");
exports.searchRequestSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    query: zod_1.z.string().min(3)
});
//# sourceMappingURL=searchMatchmaking.schema.js.map