import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  email: string
  name: string
  role: string
  isPro: boolean
  onboardingCompleted: boolean
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
  updateUser: (user: Partial<User>) => void
}

/**
 * Zustand store for authentication state management
 * Handles user authentication, token storage, and user data
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (token: string, user: User) =>
        set({
          token,
          user,
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        }),

      updateUser: (userData: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
