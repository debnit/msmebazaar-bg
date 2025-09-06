// services/auth-service/src/config/env.ts

import dotenv from 'dotenv';
dotenv.config();

import { cleanEnv, str, port, num, bool } from 'envalid';


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
  CORS_ORIGIN: str({ default: "http://localhost:3000" }),
  
  // OAuth Configuration
  OAUTH_CALLBACK_URL: str({ default: "http://localhost:8004/auth/oauth/callback" }),
  
  // Google OAuth
  GOOGLE_CLIENT_ID: str({ default: "", desc: "Google OAuth client ID" }),
  GOOGLE_CLIENT_SECRET: str({ default: "", desc: "Google OAuth client secret" }),
  GOOGLE_OAUTH_ENABLED: bool({ default: false }),
  
  // Facebook OAuth
  FACEBOOK_APP_ID: str({ default: "", desc: "Facebook OAuth app ID" }),
  FACEBOOK_APP_SECRET: str({ default: "", desc: "Facebook OAuth app secret" }),
  FACEBOOK_OAUTH_ENABLED: bool({ default: false }),
  
  // GitHub OAuth
  GITHUB_CLIENT_ID: str({ default: "", desc: "GitHub OAuth client ID" }),
  GITHUB_CLIENT_SECRET: str({ default: "", desc: "GitHub OAuth client secret" }),
  GITHUB_OAUTH_ENABLED: bool({ default: false }),
});

