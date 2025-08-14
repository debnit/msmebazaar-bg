// src/config/index.ts
import { env } from "./env";
import { servicesConfig } from "./services";

export const Config = {
  port: env.PORT,
  jwtSecret: env.JWT_SECRET,
  frontendUrl: env.FRONTEND_URL,
  nodeEnv: env.NODE_ENV,
  logLevel: env.LOG_LEVEL,
  services: servicesConfig
} as const;
