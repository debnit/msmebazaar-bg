"use client"

import apiClient, { type ApiResponse } from "@/frontend/src/utils/api-client"
import type { User, UserRole } from "@/types/user"

// Auth request/response types
export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  user: User
  token: string
  refreshToken: string
  expiresIn: number
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber?: string
  businessName?: string
  businessType?: string
  acceptTerms: boolean
  acceptMarketing?: boolean
}

export interface RegisterResponse {
  user: User
  token: string
  refreshToken: string
  requiresVerification: boolean
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
  confirmPassword: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface VerifyEmailRequest {
  token: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  businessName?: string
  businessType?: string
  address?: {
    street: string
    city: string
    state: string
    pincode: string
    country: string
  }
  preferences?: {
    language: string
    timezone: string
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
    }
  }
}

export interface TwoFactorSetupRequest {
  method: "sms" | "email" | "authenticator"
  phoneNumber?: string
}

export interface TwoFactorVerifyRequest {
  code: string
  method: "sms" | "email" | "authenticator"
}

// Auth Service Class
class AuthService {
  private readonly baseUrl = "/auth"

  /**
   * Login user with email and password
   */
  async login(request: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await apiClient.post<LoginResponse>(`${this.baseUrl}/login`, request)

      // Store auth token if login successful
      if (response.success && response.data?.token) {
        apiClient.setAuthToken(response.data.token)

        // Store refresh token
        if (response.data.refreshToken) {
          localStorage.setItem("refresh_token", response.data.refreshToken)
        }

        // Store user data
        localStorage.setItem("user_data", JSON.stringify(response.data.user))
      }

      return response
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  /**
   * Register new user account
   */
  async register(request: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    try {
      const response = await apiClient.post<RegisterResponse>(`${this.baseUrl}/register`, request)

      // Store auth token if registration successful and doesn't require verification
      if (response.success && response.data?.token && !response.data.requiresVerification) {
        apiClient.setAuthToken(response.data.token)

        if (response.data.refreshToken) {
          localStorage.setItem("refresh_token", response.data.refreshToken)
        }

        localStorage.setItem("user_data", JSON.stringify(response.data.user))
      }

      return response
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post<void>(`${this.baseUrl}/logout`)

      // Clear local storage regardless of API response
      this.clearAuthData()

      return response
    } catch (error) {
      console.error("Logout error:", error)
      // Clear local data even if API call fails
      this.clearAuthData()
      throw error
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      return await apiClient.get<User>(`${this.baseUrl}/me`)
    } catch (error) {
      console.error("Get current user error:", error)
      throw error
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(request?: RefreshTokenRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const refreshToken = request?.refreshToken || localStorage.getItem("refresh_token")

      if (!refreshToken) {
        throw new Error("No refresh token available")
      }

      const response = await apiClient.post<LoginResponse>(`${this.baseUrl}/refresh`, {
        refreshToken,
      })

      // Update stored tokens
      if (response.success && response.data?.token) {
        apiClient.setAuthToken(response.data.token)

        if (response.data.refreshToken) {
          localStorage.setItem("refresh_token", response.data.refreshToken)
        }

        localStorage.setItem("user_data", JSON.stringify(response.data.user))
      }

      return response
    } catch (error) {
      console.error("Refresh token error:", error)
      // Clear auth data if refresh fails
      this.clearAuthData()
      throw error
    }
  }

  /**
   * Send forgot password email
   */
  async forgotPassword(request: ForgotPasswordRequest): Promise<ApiResponse<void>> {
    try {
      return await apiClient.post<void>(`${this.baseUrl}/forgot-password`, request)
    } catch (error) {
      console.error("Forgot password error:", error)
      throw error
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(request: ResetPasswordRequest): Promise<ApiResponse<void>> {
    try {
      return await apiClient.post<void>(`${this.baseUrl}/reset-password`, request)
    } catch (error) {
      console.error("Reset password error:", error)
      throw error
    }
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(request: ChangePasswordRequest): Promise<ApiResponse<void>> {
    try {
      return await apiClient.put<void>(`${this.baseUrl}/change-password`, request)
    } catch (error) {
      console.error("Change password error:", error)
      throw error
    }
  }

  /**
   * Verify email address
   */
  async verifyEmail(request: VerifyEmailRequest): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.post<User>(`${this.baseUrl}/verify-email`, request)

      // Update stored user data if verification successful
      if (response.success && response.data) {
        localStorage.setItem("user_data", JSON.stringify(response.data))
      }

      return response
    } catch (error) {
      console.error("Verify email error:", error)
      throw error
    }
  }

  /**
   * Resend email verification
   */
  async resendVerification(): Promise<ApiResponse<void>> {
    try {
      return await apiClient.post<void>(`${this.baseUrl}/resend-verification`)
    } catch (error) {
      console.error("Resend verification error:", error)
      throw error
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(request: UpdateProfileRequest): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.put<User>(`${this.baseUrl}/profile`, request)

      // Update stored user data
      if (response.success && response.data) {
        localStorage.setItem("user_data", JSON.stringify(response.data))
      }

      return response
    } catch (error) {
      console.error("Update profile error:", error)
      throw error
    }
  }

  /**
   * Setup two-factor authentication
   */
  async setupTwoFactor(
    request: TwoFactorSetupRequest,
  ): Promise<ApiResponse<{ qrCode?: string; backupCodes?: string[] }>> {
    try {
      return await apiClient.post(`${this.baseUrl}/2fa/setup`, request)
    } catch (error) {
      console.error("Setup 2FA error:", error)
      throw error
    }
  }

  /**
   * Verify two-factor authentication
   */
  async verifyTwoFactor(request: TwoFactorVerifyRequest): Promise<ApiResponse<void>> {
    try {
      return await apiClient.post<void>(`${this.baseUrl}/2fa/verify`, request)
    } catch (error) {
      console.error("Verify 2FA error:", error)
      throw error
    }
  }

  /**
   * Disable two-factor authentication
   */
  async disableTwoFactor(password: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.post<void>(`${this.baseUrl}/2fa/disable`, { password })
    } catch (error) {
      console.error("Disable 2FA error:", error)
      throw error
    }
  }

  /**
   * Get user sessions
   */
  async getSessions(): Promise<
    ApiResponse<
      Array<{
        id: string
        deviceName: string
        ipAddress: string
        location: string
        lastActive: string
        current: boolean
      }>
    >
  > {
    try {
      return await apiClient.get(`${this.baseUrl}/sessions`)
    } catch (error) {
      console.error("Get sessions error:", error)
      throw error
    }
  }

  /**
   * Revoke user session
   */
  async revokeSession(sessionId: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.delete(`${this.baseUrl}/sessions/${sessionId}`)
    } catch (error) {
      console.error("Revoke session error:", error)
      throw error
    }
  }

  /**
   * Revoke all sessions except current
   */
  async revokeAllSessions(): Promise<ApiResponse<void>> {
    try {
      return await apiClient.post<void>(`${this.baseUrl}/sessions/revoke-all`)
    } catch (error) {
      console.error("Revoke all sessions error:", error)
      throw error
    }
  }

  /**
   * Check if user has specific role
   */
  hasRole(user: User | null, role: UserRole): boolean {
    if (!user || !user.roles) return false
    return user.roles.includes(role)
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(user: User | null, roles: UserRole[]): boolean {
    if (!user || !user.roles) return false
    return roles.some((role) => user.roles.includes(role))
  }

  /**
   * Check if user has all specified roles
   */
  hasAllRoles(user: User | null, roles: UserRole[]): boolean {
    if (!user || !user.roles) return false
    return roles.every((role) => user.roles.includes(role))
  }

  /**
   * Check if user is Pro subscriber
   */
  isPro(user: User | null): boolean {
    return user?.subscription?.plan === "PRO" && user?.subscription?.status === "active"
  }

  /**
   * Check if user's email is verified
   */
  isEmailVerified(user: User | null): boolean {
    return user?.emailVerified === true
  }

  /**
   * Check if user's business is verified
   */
  isBusinessVerified(user: User | null): boolean {
    return user?.businessVerified === true
  }

  /**
   * Get user's subscription status
   */
  getSubscriptionStatus(user: User | null): string | null {
    return user?.subscription?.status || null
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      const currentTime = Date.now() / 1000
      return payload.exp < currentTime
    } catch {
      return true
    }
  }

  /**
   * Get stored auth token
   */
  getStoredToken(): string | null {
    return apiClient.getAuthToken()
  }

  /**
   * Get stored user data
   */
  getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem("user_data")
      return userData ? JSON.parse(userData) : null
    } catch {
      return null
    }
  }

  /**
   * Clear all authentication data
   */
  clearAuthData(): void {
    apiClient.setAuthToken(null)
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user_data")
  }

  /**
   * Initialize auth state from stored data
   */
  initializeAuth(): { user: User | null; token: string | null; isAuthenticated: boolean } {
    const token = this.getStoredToken()
    const user = this.getStoredUser()

    // Check if token is valid and not expired
    const isAuthenticated = !!(token && user && !this.isTokenExpired(token))

    if (!isAuthenticated) {
      this.clearAuthData()
      return { user: null, token: null, isAuthenticated: false }
    }

    return { user, token, isAuthenticated }
  }
}

// Create singleton instance
const authService = new AuthService()

export default authService

// Export types
export type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  VerifyEmailRequest,
  RefreshTokenRequest,
  UpdateProfileRequest,
  TwoFactorSetupRequest,
  TwoFactorVerifyRequest,
}
