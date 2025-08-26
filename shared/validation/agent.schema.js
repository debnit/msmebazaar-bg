"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentSchema = void 0;
const zod_1 = require("zod");
exports.agentSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    region: zod_1.z.string()
});
//# sourceMappingURL=agent.schema.js.map