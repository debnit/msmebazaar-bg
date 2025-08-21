"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.msmeUpdateSchema = exports.msmeSchema = void 0;
const zod_1 = require("zod");
exports.msmeSchema = zod_1.z.object({
    ownerId: zod_1.z.string().uuid(),
    gstNumber: zod_1.z.string().min(15).max(15),
    businessName: zod_1.z.string().min(3),
    address: zod_1.z.string().optional()
});
exports.msmeUpdateSchema = exports.msmeSchema.partial();
//# sourceMappingURL=msme.schema.js.map