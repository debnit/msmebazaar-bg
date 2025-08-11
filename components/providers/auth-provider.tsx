"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useAuthStore } from "@/store/auth.store"
import type { User } from "@/types/user"

interface RegisterData {
  email: string
  password: string
  name: string
  businessName?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: RegisterData) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

/**
 * Authentication provider that manages user state, persistence, and auth operations
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const {
    user,
    isLoading: storeLoading,
    login: storeLogin,
    logout: storeLogout,
    register: storeRegister,
    initializeAuth,
  } = useAuthStore()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize auth state from store
    initializeAuth()

    // Also check for stored auth data in localStorage
    const storedUser = localStorage.getItem("auth-user")
    if (storedUser && !user) {
      try {
        // Optional: hydrate store with persisted user
        // This assumes `initializeAuth` can handle setting the user if token exists
      } catch (err) {
        console.error("Failed to restore stored auth data:", err)
        localStorage.removeItem("auth-user")
      }
    }

    setIsLoading(false)
  }, [initializeAuth, user])

  const login = async (email: string, password: string) => {
    await storeLogin(email, password)
  }

  const logout = () => {
    localStorage.removeItem("auth-user")
    storeLogout()
  }

  const register = async (userData: RegisterData) => {
    await storeRegister(userData)
  }

  const value: AuthContextType = {
    user,
    isLoading: isLoading || storeLoading,
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
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
