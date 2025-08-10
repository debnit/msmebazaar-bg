"use client"

import type React from "react"

import { createContext, useContext, useEffect } from "react"
import { useAuthStore } from "@/store/auth.store"
import type { User } from "@/types/user"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: RegisterData) => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  name: string
  businessName?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

/**
 * Authentication provider that manages user state and auth operations
 * Uses Zustand store for state management
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { user, isLoading, isAuthenticated, login, logout, register, initializeAuth } = useAuthStore()

  useEffect(() => {
    // Initialize auth state on app load
    initializeAuth()
  }, [initializeAuth])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to access auth context
 * Must be used within AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
