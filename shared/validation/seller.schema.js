"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellerSchema = void 0;
const zod_1 = require("zod");
exports.sellerSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    productCatalog: zod_1.z.array(zod_1.z.string()).optional()
});
//# sourceMappingURL=seller.schema.js.map