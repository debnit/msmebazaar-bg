// services/auth-service/src/config/env.ts
import { cleanEnv, str, port, num } from 'envalid';

export const Config = cleanEnv(process.env, {
  NODE_ENV: str({ 
    choices: ['development', 'test', 'production', 'staging'],
    default: 'development'
  }),
  PORT: port({ default: 3001 }),
  LOG_LEVEL: str({ 
    choices: ['fatal', 'error', 'warn', 'info', 'debug', 'trace'],
    default: 'info' 
  }),
  JWT_SECRET: str({ desc: 'JWT signing secret' }),
  JWT_EXPIRES_IN: str({ default: '15m' }),
  JWT_REFRESH_SECRET: str({ desc: 'JWT refresh token secret' }),
  JWT_REFRESH_EXPIRES_IN: str({ default: '7d' }),
  DATABASE_URL: str({ desc: 'Database connection string' }),
  REDIS_URL: str({ desc: 'Redis connection string for sessions' }),
  BCRYPT_ROUNDS: num({ default: 12 }),
  CORS_ORIGIN: str({ default: '*' })
});
