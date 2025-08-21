"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listingSchema = void 0;
const zod_1 = require("zod");
exports.listingSchema = zod_1.z.object({
    title: zod_1.z.string().min(2, "Title is required"),
    description: zod_1.z.string().min(5, "Description required")
});
//# sourceMappingURL=listing.schema.js.map