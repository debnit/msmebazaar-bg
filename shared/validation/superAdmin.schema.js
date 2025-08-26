"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.superAdminCreateSchema = void 0;
const zod_1 = require("zod");
exports.superAdminCreateSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(10),
    role: zod_1.z.literal("super_admin")
});
//# sourceMappingURL=superAdmin.schema.js.map