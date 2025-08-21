// src/config/env.ts
import dotenvSafe from "dotenv-safe";
import path from "path";

if (process.env.NODE_ENV !== "production") {
  dotenvSafe.config({
    allowEmptyValues: false,
    path: path.resolve(process.cwd(), ".env"),
    example: path.resolve(process.cwd(), ".env.example"),
  });
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.GATEWAY_PORT || "3000", 10),
  JWT_SECRET: process.env.JWT_SECRET || "changeme",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  FRONTEND_URL: process.env.FRONTEND_URL || "*",
};
