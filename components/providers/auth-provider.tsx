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
  const {
    user,
    isLoading,
    login: storeLogin,
    logout: storeLogout,
    register: storeRegister,
    initializeAuth,
  } = useAuthStore()

  useEffect(() => {
    // Initialize auth state from localStorage/cookies on mount
    initializeAuth()
  }, [initializeAuth])

  const login = async (email: string, password: string) => {
    await storeLogin(email, password)
  }

  const logout = () => {
    storeLogout()
  }

  const register = async (userData: RegisterData) => {
    await storeRegister(userData)
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to access authentication context
 * Must be used within AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
