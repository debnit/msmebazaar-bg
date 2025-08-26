// src/config/index.ts
import { env } from "./env";
import{ servicesConfig } from "./services";

export const Config : { [key: string]: any } = {
  port: env.PORT || 6000,
  jwtSecret: env.JWT_SECRET,
  frontendUrl: env.FRONTEND_URL,
  nodeEnv: env.NODE_ENV,
  logLevel: env.LOG_LEVEL,
  services: servicesConfig
} as const;


