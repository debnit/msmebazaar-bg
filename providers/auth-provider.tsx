"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User, UserRole } from "@/types/user"
import { authApi } from "@/services/auth.api"
import { useToast } from "@/hooks/use-toast"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  hasRole: (role: UserRole) => boolean
  hasAnyRole: (roles: UserRole[]) => boolean
  isPro: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const isAuthenticated = !!user
  const isPro = user?.subscription?.plan === "PRO" || false

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (!token) {
          setIsLoading(false)
          return
        }

        const response = await authApi.getCurrentUser()
        if (response.success && response.data) {
          setUser(response.data)
        } else {
          localStorage.removeItem("auth_token")
        }
      } catch (error) {
        console.error("Auth initialization failed:", error)
        localStorage.removeItem("auth_token")
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await authApi.login({ email, password })

      if (response.success && response.data) {
        setUser(response.data.user)
        localStorage.setItem("auth_token", response.data.token)
        
        toast({
          title: "Welcome back!",
          description: `Hello ${response.data.user.firstName}, you're successfully logged in.`,
        })

        return true
      } else {
        toast({
          title: "Login Failed",
          description: response.message || "Invalid credentials",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: error instanceof Error ? error.message : "Login failed",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      localStorage.removeItem("auth_token")
      router.push("/login")
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })
    }
  }

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await authApi.getCurrentUser()
      if (response.success && response.data) {
        setUser(response.data)
      }
    } catch (error) {
      console.error("Failed to refresh user:", error)
    }
  }

  const hasRole = (role: UserRole): boolean => {
    return user?.roles?.includes(role) || false
  }

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some(role => user?.roles?.includes(role)) || false
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser,
    hasRole,
    hasAnyRole,
    isPro,
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