// services/auth-service/src/config/env.ts
import { cleanEnv, str, port, num } from 'envalid';

export const Config = cleanEnv(process.env, {
  NODE_ENV: str({ 
    choices: ['development', 'test', 'production', 'staging'],
    default: 'development'
  }),
  PORT: port({ default: 8004 }),
  LOG_LEVEL: str({ 
    choices: ['fatal', 'error', 'warn', 'info', 'debug', 'trace'],
    default: 'info' 
  }),
  JWT_SECRET: str({ desc: "your-super-secret-jwt-key"}),
  JWT_EXPIRES_IN: str({ default: '7d' }),
  JWT_REFRESH_SECRET: str({ desc: "your-super-secret-jwt-key"}),
  JWT_REFRESH_EXPIRES_IN: str({ default: '7d' }),
  DATABASE_URL: str({ desc: "postgresql://postgres:postgres@localhost:5432/msmebazaar"}),
  REDIS_URL: str({ desc: "redis://localhost:6379"}),
  BCRYPT_ROUNDS: num({ default: 12 }),
  CORS_ORIGIN: str({ default: "http://localhost:2000" })
});
