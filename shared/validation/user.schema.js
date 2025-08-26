"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIdParamSchema = exports.updatePreferencesSchema = exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
// Profile update
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters").optional(),
    phone: zod_1.z.string().optional(),
    avatarUrl: zod_1.z.string().url().optional(),
    bio: zod_1.z.string().max(500).optional(),
    address: zod_1.z.string().optional(),
    socialLinks: zod_1.z.record(zod_1.z.string().url()).optional(), // e.g., {linkedin: "..."}
});
// User preference update (if you support it)
exports.updatePreferencesSchema = zod_1.z.object({
    theme: zod_1.z.enum(["light", "dark"]).optional(),
    notifications: zod_1.z.boolean().optional(),
    // extend as needed
});
// User basic info fetch (for request param validation)
exports.userIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
//# sourceMappingURL=user.schema.js.map