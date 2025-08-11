"use client"

import { useContext, useEffect, useState } from "react"
import type { User, UserRole, SubscriptionPlan } from "@/types/user"
import { AuthContext } from "@/components/providers/auth-provider"
import { authApi } from "@/services/auth.api"
import { useToast } from "@/hooks/use-toast"

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  roles: UserRole[]
  subscription: SubscriptionPlan | null
  isPro: boolean
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<boolean>
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  forgotPassword: (email: string) => Promise<boolean>
  resetPassword: (token: string, newPassword: string) => Promise<boolean>
  verifyEmail: (token: string) => Promise<boolean>
  resendVerification: () => Promise<boolean>
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  businessName?: string
  phoneNumber?: string
  acceptTerms: boolean
}

export interface UseAuthReturn extends AuthState, AuthActions {}

export const useAuth = (): UseAuthReturn => {
  const context = useContext(AuthContext)
  const { toast } = useToast()

  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    roles: [],
    subscription: null,
    isPro: false,
  })

  // Initialize auth state from context if available
  useEffect(() => {
    if (context) {
      setState((prev) => ({
        ...prev,
        user: context.user,
        isAuthenticated: context.isAuthenticated,
        isLoading: context.isLoading,
        roles: context.user?.roles || [],
        subscription: context.user?.subscription || null,
        isPro: context.user?.subscription?.plan === "PRO" || false,
      }))
    }
  }, [context])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      const response = await authApi.login({ email, password })

      if (response.success && response.data) {
        const user = response.data.user
        setState((prev) => ({
          ...prev,
          user,
          isAuthenticated: true,
          isLoading: false,
          roles: user.roles || [],
          subscription: user.subscription || null,
          isPro: user.subscription?.plan === "PRO" || false,
        }))

        // Store token
        if (response.data.token) {
          localStorage.setItem("auth_token", response.data.token)
        }

        toast({
          title: "Welcome back!",
          description: `Hello ${user.firstName}, you're successfully logged in.`,
        })

        return true
      } else {
        setState((prev) => ({
          ...prev,
          error: response.message || "Login failed",
          isLoading: false,
        }))

        toast({
          title: "Login Failed",
          description: response.message || "Invalid credentials",
          variant: "destructive",
        })

        return false
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed"
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }))

      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      })

      return false
    }
  }

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      const response = await authApi.register(userData)

      if (response.success && response.data) {
        const user = response.data.user
        setState((prev) => ({
          ...prev,
          user,
          isAuthenticated: true,
          isLoading: false,
          roles: user.roles || [],
          subscription: user.subscription || null,
          isPro: user.subscription?.plan === "PRO" || false,
        }))

        // Store token
        if (response.data.token) {
          localStorage.setItem("auth_token", response.data.token)
        }

        toast({
          title: "Account Created!",
          description: `Welcome ${user.firstName}! Your account has been created successfully.`,
        })

        return true
      } else {
        setState((prev) => ({
          ...prev,
          error: response.message || "Registration failed",
          isLoading: false,
        }))

        toast({
          title: "Registration Failed",
          description: response.message || "Failed to create account",
          variant: "destructive",
        })

        return false
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed"
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }))

      toast({
        title: "Registration Error",
        description: errorMessage,
        variant: "destructive",
      })

      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }))

      await authApi.logout()

      // Clear local storage
      localStorage.removeItem("auth_token")

      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        roles: [],
        subscription: null,
        isPro: false,
      })

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })
    } catch (error) {
      console.error("Logout error:", error)
      // Force logout even if API call fails
      localStorage.removeItem("auth_token")
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        roles: [],
        subscription: null,
        isPro: false,
      })
    }
  }

  const refreshUser = async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }))

      const response = await authApi.getCurrentUser()

      if (response.success && response.data) {
        const user = response.data
        setState((prev) => ({
          ...prev,
          user,
          isAuthenticated: true,
          isLoading: false,
          roles: user.roles || [],
          subscription: user.subscription || null,
          isPro: user.subscription?.plan === "PRO" || false,
        }))
      } else {
        setState((prev) => ({
          ...prev,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          roles: [],
          subscription: null,
          isPro: false,
        }))
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to refresh user",
        roles: [],
        subscription: null,
        isPro: false,
      }))
    }
  }

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      const response = await authApi.updateProfile(data)

      if (response.success && response.data) {
        const updatedUser = response.data
        setState((prev) => ({
          ...prev,
          user: updatedUser,
          isLoading: false,
          roles: updatedUser.roles || [],
          subscription: updatedUser.subscription || null,
          isPro: updatedUser.subscription?.plan === "PRO" || false,
        }))

        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        })

        return true
      } else {
        setState((prev) => ({
          ...prev,
          error: response.message || "Update failed",
          isLoading: false,
        }))

        toast({
          title: "Update Failed",
          description: response.message || "Failed to update profile",
          variant: "destructive",
        })

        return false
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Update failed"
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }))

      toast({
        title: "Update Error",
        description: errorMessage,
        variant: "destructive",
      })

      return false
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      const response = await authApi.changePassword({ currentPassword, newPassword })

      if (response.success) {
        setState((prev) => ({ ...prev, isLoading: false }))

        toast({
          title: "Password Changed",
          description: "Your password has been changed successfully.",
        })

        return true
      } else {
        setState((prev) => ({
          ...prev,
          error: response.message || "Password change failed",
          isLoading: false,
        }))

        toast({
          title: "Password Change Failed",
          description: response.message || "Failed to change password",
          variant: "destructive",
        })

        return false
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Password change failed"
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }))

      toast({
        title: "Password Change Error",
        description: errorMessage,
        variant: "destructive",
      })

      return false
    }
  }

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      const response = await authApi.forgotPassword({ email })

      setState((prev) => ({ ...prev, isLoading: false }))

      if (response.success) {
        toast({
          title: "Reset Link Sent",
          description: "Password reset link has been sent to your email.",
        })
        return true
      } else {
        toast({
          title: "Reset Failed",
          description: response.message || "Failed to send reset link",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))

      toast({
        title: "Reset Error",
        description: error instanceof Error ? error.message : "Failed to send reset link",
        variant: "destructive",
      })

      return false
    }
  }

  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      const response = await authApi.resetPassword({ token, newPassword })

      setState((prev) => ({ ...prev, isLoading: false }))

      if (response.success) {
        toast({
          title: "Password Reset",
          description: "Your password has been reset successfully.",
        })
        return true
      } else {
        toast({
          title: "Reset Failed",
          description: response.message || "Failed to reset password",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))

      toast({
        title: "Reset Error",
        description: error instanceof Error ? error.message : "Failed to reset password",
        variant: "destructive",
      })

      return false
    }
  }

  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      const response = await authApi.verifyEmail({ token })

      if (response.success && response.data) {
        const user = response.data
        setState((prev) => ({
          ...prev,
          user,
          isLoading: false,
          roles: user.roles || [],
          subscription: user.subscription || null,
          isPro: user.subscription?.plan === "PRO" || false,
        }))

        toast({
          title: "Email Verified",
          description: "Your email has been verified successfully.",
        })

        return true
      } else {
        setState((prev) => ({ ...prev, isLoading: false }))

        toast({
          title: "Verification Failed",
          description: response.message || "Failed to verify email",
          variant: "destructive",
        })

        return false
      }
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))

      toast({
        title: "Verification Error",
        description: error instanceof Error ? error.message : "Failed to verify email",
        variant: "destructive",
      })

      return false
    }
  }

  const resendVerification = async (): Promise<boolean> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      const response = await authApi.resendVerification()

      setState((prev) => ({ ...prev, isLoading: false }))

      if (response.success) {
        toast({
          title: "Verification Sent",
          description: "Verification email has been sent to your email address.",
        })
        return true
      } else {
        toast({
          title: "Send Failed",
          description: response.message || "Failed to send verification email",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))

      toast({
        title: "Send Error",
        description: error instanceof Error ? error.message : "Failed to send verification email",
        variant: "destructive",
      })

      return false
    }
  }

  return {
    ...state,
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
  }
}

// Helper hooks for specific auth checks
export const useIsAuthenticated = (): boolean => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated
}

export const useCurrentUser = (): User | null => {
  const { user } = useAuth()
  return user
}

export const useUserRoles = (): UserRole[] => {
  const { roles } = useAuth()
  return roles
}

export const useIsPro = (): boolean => {
  const { isPro } = useAuth()
  return isPro
}

export const useHasRole = (role: UserRole): boolean => {
  const { roles } = useAuth()
  return roles.includes(role)
}

export const useHasAnyRole = (requiredRoles: UserRole[]): boolean => {
  const { roles } = useAuth()
  return requiredRoles.some((role) => roles.includes(role))
}

export const useHasAllRoles = (requiredRoles: UserRole[]): boolean => {
  const { roles } = useAuth()
  return requiredRoles.every((role) => roles.includes(role))
}
