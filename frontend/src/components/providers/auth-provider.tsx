"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useAuthStore } from "@/store/auth.store"

interface AuthContextType {
  isAuthenticated: boolean
  user: any | null
  login: (token: string, user: any) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Authentication provider component for MSMEBazaar
 * Manages user authentication state and provides auth context
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, token, setAuth, clearAuth } = useAuthStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth token on mount
    const storedToken = localStorage.getItem("auth-token")
    const storedUser = localStorage.getItem("auth-user")

    if (storedToken && storedUser) {
      try {
        setAuth(storedToken, JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user data:", error)
        localStorage.removeItem("auth-token")
        localStorage.removeItem("auth-user")
      }
    }

    setLoading(false)
  }, [setAuth])

  const login = (token: string, user: any) => {
    localStorage.setItem("auth-token", token)
    localStorage.setItem("auth-user", JSON.stringify(user))
    setAuth(token, user)
  }

  const logout = () => {
    localStorage.removeItem("auth-token")
    localStorage.removeItem("auth-user")
    clearAuth()
  }

  const value: AuthContextType = {
    isAuthenticated: !!token && !!user,
    user,
    login,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
