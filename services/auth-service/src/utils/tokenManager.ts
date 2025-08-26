// services/auth-service/src/utils/tokenManager.ts
import jwt from 'jsonwebtoken';
import { Config } from '../config/env';

export interface TokenPayload {
  userId: string;
  email: string;
  roles: string[];
}

export class TokenManager {
  static generateTokens(payload: TokenPayload) {
    const accessToken = jwt.sign(
      payload,
      Config.JWT_SECRET,
      { 
        expiresIn: Config.JWT_EXPIRES_IN,
        issuer: 'auth-service',
        audience: 'msmebazaar-api'
      }
    );

    const refreshToken = jwt.sign(
      { userId: payload.userId },
      Config.JWT_REFRESH_SECRET,
      { 
        expiresIn: Config.JWT_REFRESH_EXPIRES_IN,
        issuer: 'auth-service',
        audience: 'msmebazaar-api'
      }
    );

    return { accessToken, refreshToken };
  }

  static verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, Config.JWT_SECRET, {
      issuer: 'auth-service',
      audience: 'msmebazaar-api'
    }) as TokenPayload;
  }

  static verifyRefreshToken(token: string) {
    return jwt.verify(token, Config.JWT_REFRESH_SECRET, {
      issuer: 'auth-service', 
      audience: 'msmebazaar-api'
    });
  }
}
