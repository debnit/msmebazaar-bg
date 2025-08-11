import { apiClient } from "./api-client"
import type { 
  User, 
  LoginForm, 
  RegisterForm, 
  LoginResponse, 
  RegisterResponse, 
  UserResponse 
} from "@/types/user"

export const authApi = {
  /**
   * Login user with email and password
   */
  login: async (credentials: LoginForm): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>("/auth/login", credentials)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      }
    }
  },

  /**
   * Register new user
   */
  register: async (userData: RegisterForm): Promise<RegisterResponse> => {
    try {
      const response = await apiClient.post<RegisterResponse>("/auth/register", userData)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      }
    }
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<UserResponse> => {
    try {
      const response = await apiClient.get<UserResponse>("/auth/me")
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to get user",
      }
    }
  },

  /**
   * Logout user
   */
  logout: async (): Promise<{ success: boolean; message?: string }> => {
    try {
      await apiClient.post("/auth/logout")
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Logout failed",
      }
    }
  },

  /**
   * Refresh authentication token
   */
  refreshToken: async (): Promise<{ success: boolean; token?: string; message?: string }> => {
    try {
      const response = await apiClient.post<{ token: string }>("/auth/refresh")
      return {
        success: true,
        token: response.data.token,
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Token refresh failed",
      }
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: Partial<User>): Promise<UserResponse> => {
    try {
      const response = await apiClient.put<UserResponse>("/auth/profile", data)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Profile update failed",
      }
    }
  },

  /**
   * Change password
   */
  changePassword: async (data: {
    currentPassword: string
    newPassword: string
  }): Promise<{ success: boolean; message?: string }> => {
    try {
      await apiClient.post("/auth/change-password", data)
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Password change failed",
      }
    }
  },

  /**
   * Request password reset
   */
  forgotPassword: async (data: { email: string }): Promise<{ success: boolean; message?: string }> => {
    try {
      await apiClient.post("/auth/forgot-password", data)
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Password reset request failed",
      }
    }
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: {
    token: string
    newPassword: string
  }): Promise<{ success: boolean; message?: string }> => {
    try {
      await apiClient.post("/auth/reset-password", data)
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Password reset failed",
      }
    }
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (data: { token: string }): Promise<UserResponse> => {
    try {
      const response = await apiClient.post<UserResponse>("/auth/verify-email", data)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Email verification failed",
      }
    }
  },

  /**
   * Resend verification email
   */
  resendVerification: async (): Promise<{ success: boolean; message?: string }> => {
    try {
      await apiClient.post("/auth/resend-verification")
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to resend verification",
      }
    }
  },
}