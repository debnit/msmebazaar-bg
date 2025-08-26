"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSchema = exports.resetPasswordSchema = exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
// User Login
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email address" }),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
// User Registration
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
    name: zod_1.z.string().min(2, "Name must be at least 2 characters"),
});
// (Optional) Password Reset
exports.resetPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
// Token Refresh (if applicable)
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(10),
});
//# sourceMappingURL=auth.schema.js.map