import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient, type ApiResponse } from "./api-client"
import type { User, UserRegistration } from "@/types/user"

/**
 * Authentication API interfaces
 */
interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  user: User
  token: string
  refreshToken: string
  expiresIn: number
}

interface RegisterRequest extends UserRegistration {
  confirmPassword: string
}

interface RegisterResponse {
  user: User
  token: string
  refreshToken: string
  message: string
}

interface RefreshTokenRequest {
  refreshToken: string
}

interface RefreshTokenResponse {
  token: string
  refreshToken: string
  expiresIn: number
}

interface ForgotPasswordRequest {
  email: string
}

interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface VerifyEmailRequest {
  token: string
}

/**
 * Authentication API service class
 * Handles all authentication-related API calls
 */
class AuthApiService {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post<ApiResponse<LoginResponse>>("/auth/login", credentials, {
      requiresAuth: false,
    })
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    return apiClient.post<ApiResponse<RegisterResponse>>("/auth/register", userData, {
      requiresAuth: false,
    })
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(request: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> {
    return apiClient.post<ApiResponse<RefreshTokenResponse>>("/auth/refresh", request, {
      requiresAuth: false,
    })
  }

  /**
   * Logout user (invalidate tokens)
   */
  async logout(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<ApiResponse<{ message: string }>>("/auth/logout")
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<ApiResponse<User>>("/auth/me")
  }

  /**
   * Send forgot password email
   */
  async forgotPassword(request: ForgotPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<ApiResponse<{ message: string }>>("/auth/forgot-password", request, {
      requiresAuth: false,
    })
  }

  /**
   * Reset password with token
   */
  async resetPassword(request: ResetPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<ApiResponse<{ message: string }>>("/auth/reset-password", request, {
      requiresAuth: false,
    })
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(request: ChangePasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<ApiResponse<{ message: string }>>("/auth/change-password", request)
  }

  /**
   * Verify email address
   */
  async verifyEmail(request: VerifyEmailRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<ApiResponse<{ message: string }>>("/auth/verify-email", request, {
      requiresAuth: false,
    })
  }

  /**
   * Resend email verification
   */
  async resendVerification(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<ApiResponse<{ message: string }>>("/auth/resend-verification")
  }

  /**
   * Update user profile
   */
  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.patch<ApiResponse<User>>("/auth/profile", userData)
  }

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<ApiResponse<{ message: string }>>("/auth/account")
  }
}

// Export singleton instance
export const authApiService = new AuthApiService()

/**
 * React Query hooks for authentication
 */

/**
 * Hook for user login mutation
 */
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApiService.login(credentials),
    onSuccess: (response) => {
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] })
      queryClient.setQueryData(["auth", "user"], response.data?.user)
    },
    onError: (error) => {
      console.error("Login failed:", error)
    },
  })
}

/**
 * Hook for user registration mutation
 */
export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userData: RegisterRequest) => authApiService.register(userData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] })
      queryClient.setQueryData(["auth", "user"], response.data?.user)
    },
    onError: (error) => {
      console.error("Registration failed:", error)
    },
  })
}

/**
 * Hook for logout mutation
 */
export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authApiService.logout(),
    onSuccess: () => {
      // Clear all cached data on logout
      queryClient.clear()
    },
    onError: (error) => {
      console.error("Logout failed:", error)
      // Clear cache even if logout fails
      queryClient.clear()
    },
  })
}

/**
 * Hook for getting current user
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: () => authApiService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 (unauthorized)
      if (error?.status === 401) return false
      return failureCount < 3
    },
  })
}

/**
 * Hook for forgot password mutation
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (request: ForgotPasswordRequest) => authApiService.forgotPassword(request),
    onError: (error) => {
      console.error("Forgot password failed:", error)
    },
  })
}

/**
 * Hook for reset password mutation
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: (request: ResetPasswordRequest) => authApiService.resetPassword(request),
    onError: (error) => {
      console.error("Reset password failed:", error)
    },
  })
}

/**
 * Hook for change password mutation
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (request: ChangePasswordRequest) => authApiService.changePassword(request),
    onError: (error) => {
      console.error("Change password failed:", error)
    },
  })
}

/**
 * Hook for email verification mutation
 */
export function useVerifyEmail() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: VerifyEmailRequest) => authApiService.verifyEmail(request),
    onSuccess: () => {
      // Refetch user data after email verification
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] })
    },
    onError: (error) => {
      console.error("Email verification failed:", error)
    },
  })
}

/**
 * Hook for resending email verification
 */
export function useResendVerification() {
  return useMutation({
    mutationFn: () => authApiService.resendVerification(),
    onError: (error) => {
      console.error("Resend verification failed:", error)
    },
  })
}

/**
 * Hook for updating user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userData: Partial<User>) => authApiService.updateProfile(userData),
    onSuccess: (response) => {
      // Update cached user data
      queryClient.setQueryData(["auth", "user"], response.data)
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] })
    },
    onError: (error) => {
      console.error("Profile update failed:", error)
    },
  })
}

/**
 * Hook for deleting user account
 */
export function useDeleteAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authApiService.deleteAccount(),
    onSuccess: () => {
      // Clear all data after account deletion
      queryClient.clear()
    },
    onError: (error) => {
      console.error("Account deletion failed:", error)
    },
  })
}
