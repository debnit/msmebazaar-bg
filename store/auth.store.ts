import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/types/user"

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  setToken: (token: string) => void
  initializeAuth: () => void
}

interface RegisterData {
  email: string
  password: string
  name: string
  businessName?: string
}

type AuthStore = AuthState & AuthActions

/**
 * Zustand store for authentication state management
 * Handles user authentication, token storage, and user data
 * Persists auth data to localStorage
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          // TODO: Replace with actual API call
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          })

          if (!response.ok) {
            throw new Error("Login failed")
          }

          const { user, token } = await response.json()

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true })
        try {
          // TODO: Replace with actual API call
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          })

          if (!response.ok) {
            throw new Error("Registration failed")
          }

          const { user, token } = await response.json()

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true })
      },

      setToken: (token: string) => {
        set({ token })
      },

      initializeAuth: () => {
        const { token, user } = get()
        if (token && user) {
          set({ isAuthenticated: true })
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    },
  ),
)
