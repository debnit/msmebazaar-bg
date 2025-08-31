// services/auth-service/src/types/express.d.ts
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      id?: string;
      clientIP?: string;
      user?: any; // This will be set by JWT middleware
    }
  }
}

export {};
