// Shared auth store (works with both Zustand and Redux)
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  roles: z.array(z.string()),
  isPro: z.boolean(),
});

export type User = z.infer<typeof UserSchema>;

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;

// Base implementation - platform-specific stores extend this
export const createAuthStore = (implementation: {
  storage: {
    getItem: (key: string) => Promise<string | null>;
    setItem: (key: string, value: string) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
  };
  apiClient: any;
}) => {
  // Store creation logic here
  return implementation;
};
