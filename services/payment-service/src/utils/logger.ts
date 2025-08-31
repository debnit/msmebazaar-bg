// PRODUCTION-ENHANCED LOGGER
import pino from "pino";
import { env } from "../config/env";

const isDevelopment = env.nodeEnv === 'development';

// Only attempt to load pino-pretty if available
let transport;
if (isDevelopment) {
  try {
    const target = require.resolve("pino-pretty");
    transport = {
      target,
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    };
  } catch {
    // fallback to JSON logging if pino-pretty isn't installed
    transport = undefined;
  }
}

export const logger = pino({
  level: env.logLevel || "info",
  base: {
    service: "payment-service",
    version: process.env.npm_package_version || "1.0.0",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label }),
  },
  transport,
  redact: {
    paths: [
      "*.password",
      "*.token",
      "*.authorization",
      "*.razorpayKeySecret",
      "*.creditCard",
      "*.cvv",
    ],
    censor: "[REDACTED]",
  },
});