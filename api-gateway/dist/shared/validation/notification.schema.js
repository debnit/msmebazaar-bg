"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationSchema = void 0;
const zod_1 = require("zod");
exports.notificationSchema = zod_1.z.object({
    type: zod_1.z.string().min(3),
    message: zod_1.z.string().min(3),
    read: zod_1.z.boolean().optional()
});
//# sourceMappingURL=notification.schema.js.map