"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api, type ApiResponse } from "./api-client"
import type { User, UserRegistration } from "@/types/user"

// 🔹 Token Manager to handle access/refresh tokens
class TokenManager {
  static setTokens(token: string, refreshToken: string) {
    localStorage.setItem("auth_token", token)
    localStorage.setItem("refresh_token", refreshToken)
  }

  static getAccessToken() {
    return localStorage.getItem("auth_token")
  }

  static getRefreshToken() {
    return localStorage.getItem("refresh_token")
  }

  static clearTokens() {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("refresh_token")
  }
}

// 🔹 Central Error Handler
function handleApiError(error: any) {
  if (error?.response?.data?.message) return error.response.data.message
  if (error?.message) return error.message
  return "An unexpected error occurred"
}

// ---------------------------------------------------------
// 🔹 Service Layer
// ---------------------------------------------------------

class AuthApiService {
  async login(credentials: { email: string; password: string }) {
    const resp = await api.auth.login(credentials)
    if (resp.success && resp.data?.token) {
      TokenManager.setTokens(resp.data.token, resp.data.refreshToken)
    }
    return resp
  }

  async register(data: UserRegistration & { confirmPassword: string }) {
    const resp = await api.auth.register(data)
    if (resp.success && resp.data?.token) {
      TokenManager.setTokens(resp.data.token, resp.data.refreshToken)
    }
    return resp
  }

  async refreshToken() {
    const refreshToken = TokenManager.getRefreshToken()
    const resp = await api.auth.refreshToken({ refreshToken })
    if (resp.success && resp.data?.token) {
      TokenManager.setTokens(resp.data.token, resp.data.refreshToken)
    }
    return resp
  }

  async logout() {
    try {
      await api.auth.logout()
    } finally {
      TokenManager.clearTokens()
    }
    return { success: true, message: "Logged out" }
  }

  async getCurrentUser() {
    return api.user.getProfile()
  }

  async updateProfile(userData: Partial<User>) {
    return api.user.updateProfile(userData)
  }

  async deleteAccount() {
    const resp = await apiClient.delete<ApiResponse<{ message: string }>>("/auth/account")
    TokenManager.clearTokens()
    return resp
  }

  async forgotPassword(email: string) {
    return api.auth.forgotPassword(email)
  }

  async resetPassword(token: string, password: string, confirmPassword: string) {
    return api.auth.resetPassword(token, password, confirmPassword)
  }

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    return api.user.changePassword(data)
  }

  async verifyEmail(token: string) {
    return api.auth.verifyEmail(token)
  }
}

export const authApiService = new AuthApiService()

// ---------------------------------------------------------
// 🔹 React Query Hooks
// ---------------------------------------------------------

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      authApiService.login(credentials),
    onSuccess: (response) => {
      if (response.success && response.data?.user) {
        queryClient.setQueryData(["auth", "user"], response.data.user)
      }
    },
    onError: (error) => {
      console.error("Login failed:", handleApiError(error))
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UserRegistration & { confirmPassword: string }) =>
      authApiService.register(data),
    onSuccess: (response) => {
      if (response.success && response.data?.user) {
        queryClient.setQueryData(["auth", "user"], response.data.user)
      }
    },
    onError: (error) => {
      console.error("Registration failed:", handleApiError(error))
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => authApiService.logout(),
    onSuccess: () => queryClient.clear(),
    onError: (error) => {
      console.error("Logout failed:", handleApiError(error))
      queryClient.clear()
    },
  })
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      const resp = await authApiService.getCurrentUser()
      return resp.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      if (error?.status === 401) return false
      return failureCount < 2
    },
  })
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: () => authApiService.refreshToken(),
    onError: (error) => {
      console.error("Token refresh failed:", handleApiError(error))
      TokenManager.clearTokens()
    },
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userData: Partial<User>) => authApiService.updateProfile(userData),
    onSuccess: (response) => {
      if (response.success && response.data) {
        queryClient.setQueryData(["auth", "user"], response.data)
      }
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] })
    },
    onError: (error) => {
      console.error("Profile update failed:", handleApiError(error))
    },
  })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => authApiService.deleteAccount(),
    onSuccess: () => {
      queryClient.clear()
    },
    onError: (error) => {
      console.error("Account deletion failed:", handleApiError(error))
      queryClient.clear()
      TokenManager.clearTokens()
    },
  })
}
