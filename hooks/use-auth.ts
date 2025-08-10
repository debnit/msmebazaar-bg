"use client"

import { useAuthStore } from "@/store/auth.store"
import { useLoginMutation, useLogoutMutation, useRefreshTokenMutation } from "@/services/auth.api"
import { useRouter } from "next/navigation"
import { useCallback, useEffect } from "react"
import { toast } from "@/hooks/use-toast"

/**
 * Custom hook for authentication operations and state management
 * Provides login, logout, token refresh, and auth state access
 */
export const useAuth = () => {
  const router = useRouter()
  const { user, token, refreshToken, isAuthenticated, isPro, roles, setAuth, clearAuth, updateUser, setProStatus } =
    useAuthStore()

  const loginMutation = useLoginMutation()
  const logoutMutation = useLogoutMutation()
  const refreshTokenMutation = useRefreshTokenMutation()

  /**
   * Login user with email and password
   */
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await loginMutation.mutateAsync({ email, password })

        setAuth({
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken,
        })

        toast({
          title: "Login Successful",
          description: `Welcome back, ${response.user.name}!`,
        })

        // Redirect based on user status
        if (!response.user.isOnboarded) {
          router.push("/onboarding")
        } else if (!response.user.isPro) {
          router.push("/onboarding-welcome")
        } else {
          router.push("/dashboard")
        }

        return response
      } catch (error: any) {
        toast({
          title: "Login Failed",
          description: error.message || "Invalid credentials",
          variant: "destructive",
        })
        throw error
      }
    },
    [loginMutation, setAuth, router],
  )

  /**
   * Logout user and clear session
   */
  const logout = useCallback(async () => {
    try {
      if (token) {
        await logoutMutation.mutateAsync()
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      clearAuth()
      router.push("/login")
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      })
    }
  }, [logoutMutation, clearAuth, router, token])

  /**
   * Refresh authentication token
   */
  const refreshAuthToken = useCallback(async () => {
    if (!refreshToken) {
      throw new Error("No refresh token available")
    }

    try {
      const response = await refreshTokenMutation.mutateAsync({ refreshToken })

      setAuth({
        user: response.user,
        token: response.token,
        refreshToken: response.refreshToken,
      })

      return response.token
    } catch (error) {
      clearAuth()
      router.push("/login")
      throw error
    }
  }, [refreshToken, refreshTokenMutation, setAuth, clearAuth, router])

  /**
   * Update user profile information
   */
  const updateProfile = useCallback(
    (updates: Partial<typeof user>) => {
      if (user) {
        updateUser({ ...user, ...updates })
      }
    },
    [user, updateUser],
  )

  /**
   * Check if user has specific role
   */
  const hasRole = useCallback(
    (role: string) => {
      return roles.includes(role)
    },
    [roles],
  )

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = useCallback(
    (roleList: string[]) => {
      return roleList.some((role) => roles.includes(role))
    },
    [roles],
  )

  /**
   * Check if user has all specified roles
   */
  const hasAllRoles = useCallback(
    (roleList: string[]) => {
      return roleList.every((role) => roles.includes(role))
    },
    [roles],
  )

  /**
   * Upgrade user to Pro status
   */
  const upgradeToPro = useCallback(() => {
    setProStatus(true)
    if (user) {
      updateUser({ ...user, isPro: true })
    }
    toast({
      title: "Welcome to MSMEBazaar Pro!",
      description: "You now have access to all premium features",
    })
  }, [setProStatus, user, updateUser])

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    if (!token || !refreshToken) return

    const tokenPayload = JSON.parse(atob(token.split(".")[1]))
    const expirationTime = tokenPayload.exp * 1000
    const currentTime = Date.now()
    const timeUntilExpiry = expirationTime - currentTime

    // Refresh token 5 minutes before expiry
    const refreshTime = timeUntilExpiry - 5 * 60 * 1000

    if (refreshTime > 0) {
      const timeoutId = setTimeout(() => {
        refreshAuthToken().catch(console.error)
      }, refreshTime)

      return () => clearTimeout(timeoutId)
    }
  }, [token, refreshToken, refreshAuthToken])

  return {
    // State
    user,
    token,
    isAuthenticated,
    isPro,
    roles,

    // Actions
    login,
    logout,
    refreshAuthToken,
    updateProfile,
    upgradeToPro,

    // Role checks
    hasRole,
    hasAnyRole,
    hasAllRoles,

    // Loading states
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isRefreshing: refreshTokenMutation.isPending,
  }
}

export default useAuth
