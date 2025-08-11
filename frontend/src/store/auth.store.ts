"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/types/user"

export interface RegisterData {
  email: string
  password: string
  name: string
  businessName?: string
  phone?: string
}

export interface LoginData {
  email: string
  password: string
}

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  isPro: boolean
  roles: string[]
  activeRole: string | null
  sessionExpiry: number | null
}

interface AuthActions {
  login: (data: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  refreshAuth: () => Promise<void>
  setUser: (user: User) => void
  setTokens: (token: string, refreshToken?: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setProStatus: (isPro: boolean) => void
  setRoles: (roles: string[]) => void
  setActiveRole: (role: string) => void
  clearAuth: () => void
  initializeAuth: () => Promise<void>
  checkTokenExpiry: () => boolean
  updateUserProfile: (updates: Partial<User>) => void
}

type AuthStore = AuthState & AuthActions

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isPro: false,
  roles: [],
  activeRole: null,
  sessionExpiry: null,
}

/**
 * Zustand store for comprehensive authentication state management
 * Handles user authentication, token management, role switching, and Pro status
 * Persists critical auth data to localStorage with automatic cleanup
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Authentication actions
      login: async (data: LoginData) => {
        set({ isLoading: true, error: null })
        try {
          // This will be replaced with actual API call
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Login failed")
          }

          const { user, token, refreshToken, expiresIn } = await response.json()

          const sessionExpiry = Date.now() + expiresIn * 1000

          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            isPro: user.isPro || false,
            roles: user.roles || [],
            activeRole: user.roles?.[0] || null,
            sessionExpiry,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Login failed",
            isLoading: false,
            isAuthenticated: false,
          })
          throw error
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Registration failed")
          }

          const { user, token, refreshToken, expiresIn } = await response.json()

          const sessionExpiry = Date.now() + expiresIn * 1000

          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            isPro: user.isPro || false,
            roles: user.roles || ["msmeOwner"],
            activeRole: "msmeOwner",
            sessionExpiry,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Registration failed",
            isLoading: false,
            isAuthenticated: false,
          })
          throw error
        }
      },

      refreshAuth: async () => {
        const { refreshToken } = get()
        if (!refreshToken) {
          throw new Error("No refresh token available")
        }

        try {
          const response = await fetch("/api/auth/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          })

          if (!response.ok) {
            throw new Error("Token refresh failed")
          }

          const { token, refreshToken: newRefreshToken, expiresIn } = await response.json()
          const sessionExpiry = Date.now() + expiresIn * 1000

          set({
            token,
            refreshToken: newRefreshToken,
            sessionExpiry,
            error: null,
          })
        } catch (error) {
          // If refresh fails, logout user
          get().logout()
          throw error
        }
      },

      logout: () => {
        set({
          ...initialState,
        })

        // Clear any stored tokens from localStorage
        localStorage.removeItem("auth-storage")
      },

      // State setters
      setUser: (user: User) => {
        set({
          user,
          isPro: user.isPro || false,
          roles: user.roles || [],
        })
      },

      setTokens: (token: string, refreshToken?: string) => {
        set({
          token,
          ...(refreshToken && { refreshToken }),
          isAuthenticated: true,
        })
      },

      setLoading: (isLoading: boolean) => set({ isLoading }),
      setError: (error: string | null) => set({ error }),
      setProStatus: (isPro: boolean) => set({ isPro }),

      setRoles: (roles: string[]) => {
        set({
          roles,
          activeRole: roles[0] || null,
        })
      },

      setActiveRole: (role: string) => {
        const { roles } = get()
        if (roles.includes(role)) {
          set({ activeRole: role })
        } else {
          console.warn(`Role ${role} not available for user`)
        }
      },

      clearAuth: () => {
        set({ ...initialState })
      },

      // Utility functions
      initializeAuth: async () => {
        const { token, checkTokenExpiry } = get()

        if (!token) {
          return
        }

        // Check if token is expired
        if (!checkTokenExpiry()) {
          try {
            await get().refreshAuth()
          } catch (error) {
            console.error("Failed to refresh token on initialization:", error)
            get().logout()
          }
        }
      },

      checkTokenExpiry: () => {
        const { sessionExpiry } = get()
        if (!sessionExpiry) return false

        // Check if token expires in the next 5 minutes
        return Date.now() < sessionExpiry - 5 * 60 * 1000
      },

      updateUserProfile: (updates: Partial<User>) => {
        const { user } = get()
        if (user) {
          set({
            user: { ...user, ...updates },
          })
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        isPro: state.isPro,
        roles: state.roles,
        activeRole: state.activeRole,
        sessionExpiry: state.sessionExpiry,
      }),
      // Custom storage with cleanup
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name)
          if (!item) return null

          try {
            const parsed = JSON.parse(item)
            // Check if session is expired
            if (parsed.state?.sessionExpiry && Date.now() > parsed.state.sessionExpiry) {
              localStorage.removeItem(name)
              return null
            }
            return item
          } catch {
            localStorage.removeItem(name)
            return null
          }
        },
        setItem: (name, value) => {
          localStorage.setItem(name, value)
        },
        removeItem: (name) => {
          localStorage.removeItem(name)
        },
      },
    },
  ),
)

/**
 * Selector hooks for specific auth state slices
 */
export const useAuthUser = () => useAuthStore((state) => state.user)
export const useAuthToken = () => useAuthStore((state) => state.token)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)
export const useIsProUser = () => useAuthStore((state) => state.isPro)
export const useUserRoles = () => useAuthStore((state) => state.roles)
export const useActiveRole = () => useAuthStore((state) => state.activeRole)
export const useAuthLoading = () => useAuthStore((state) => state.isLoading)
export const useAuthError = () => useAuthStore((state) => state.error)
