"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.complianceDocSchema = void 0;
// /shared/validation/compliance.schema.ts
const zod_1 = require("zod");
exports.complianceDocSchema = zod_1.z.object({
    type: zod_1.z.string().min(3, "Type is required"),
    documentUrl: zod_1.z.string().url("Must be a valid URL").optional(),
    status: zod_1.z.string().optional() // default handled in repo/service
});
//# sourceMappingURL=compliance.schema.js.map