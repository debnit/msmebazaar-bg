// PRODUCTION-ENHANCED LOGGER
import pino from "pino";
import { env } from "../config/env";

const isDevelopment = env.nodeEnv === 'development';

export const logger = pino({
  level: env.logLevel || 'info',
  base: {
    service: 'payment-service',
    version: process.env.npm_package_version || '1.0.0',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label }),
  },
  ...(isDevelopment && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  }),
  redact: {
    paths: [
      '*.password',
      '*.token',
      '*.authorization',
      '*.razorpayKeySecret',
      '*.creditCard',
      '*.cvv',
    ],
    censor: '[REDACTED]',
  },
});
