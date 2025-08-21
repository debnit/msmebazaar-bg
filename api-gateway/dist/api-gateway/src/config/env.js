"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
// src/config/env.ts
const dotenv_safe_1 = __importDefault(require("dotenv-safe"));
const path_1 = __importDefault(require("path"));
if (process.env.NODE_ENV !== "production") {
    dotenv_safe_1.default.config({
        allowEmptyValues: false,
        path: path_1.default.resolve(process.cwd(), ".env"),
        example: path_1.default.resolve(process.cwd(), ".env.example"),
    });
}
exports.env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: parseInt(process.env.GATEWAY_PORT || "3000", 10),
    JWT_SECRET: process.env.JWT_SECRET || "changeme",
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
    FRONTEND_URL: process.env.FRONTEND_URL || "*",
};
//# sourceMappingURL=env.js.map