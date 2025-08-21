// /shared/types/user.ts
import { UserRole } from "./feature";

export interface SessionUser{
  id: string;
  email: string;
  name: string;
  isPro?: boolean;
  onboardedProAt?: string;
  roles: UserRole[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  address?: string;
  socialLinks?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthenticatedRequest extends Express.Request {
  session?: any;  // Make optional to match Express behavior
  user?: SessionUser;
}

export { UserRole };
