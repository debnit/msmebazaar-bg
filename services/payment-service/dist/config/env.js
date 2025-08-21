"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    port: process.env.SERVICE_PORT || 8000,
    jwtSecret: process.env.JWT_SECRET || "changeme",
    dbUrl: process.env.DATABASE_URL,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "your_test_key_id",
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "your_test_key_secret",
};
//# sourceMappingURL=env.js.map