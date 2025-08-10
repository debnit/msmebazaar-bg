"use client"

import apiClient, { type ApiResponse } from "@/utils/api-client"
import type { User } from "@/types/user"
import type { BusinessProfile } from "@/types/business"

// User profile types
export interface UserProfileUpdate {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  dateOfBirth?: string
  gender?: "male" | "female" | "other" | "prefer_not_to_say"
  profilePicture?: File
  bio?: string
  website?: string
  socialLinks?: {
    linkedin?: string
    twitter?: string
    facebook?: string
    instagram?: string
  }
}

export interface UserAddress {
  id?: string
  type: "home" | "work" | "billing" | "shipping"
  label?: string
  street: string
  apartment?: string
  city: string
  state: string
  pincode: string
  country: string
  isDefault: boolean
  landmark?: string
}

export interface UserPreferences {
  language: string
  timezone: string
  currency: string
  dateFormat: string
  notifications: {
    email: {
      marketing: boolean
      orderUpdates: boolean
      securityAlerts: boolean
      newsletter: boolean
      productUpdates: boolean
    }
    sms: {
      orderUpdates: boolean
      securityAlerts: boolean
      promotions: boolean
    }
    push: {
      orderUpdates: boolean
      messages: boolean
      promotions: boolean
      reminders: boolean
    }
    whatsapp: {
      orderUpdates: boolean
      promotions: boolean
      support: boolean
    }
  }
  privacy: {
    profileVisibility: "public" | "private" | "business_only"
    showEmail: boolean
    showPhone: boolean
    allowBusinessContact: boolean
    dataProcessingConsent: boolean
  }
  dashboard: {
    defaultView: "overview" | "analytics" | "orders" | "products"
    widgetPreferences: Record<string, boolean>
    theme: "light" | "dark" | "system"
  }
}

export interface UserActivity {
  id: string
  type: "login" | "profile_update" | "order" | "payment" | "business_action" | "security"
  description: string
  metadata?: Record<string, any>
  ipAddress: string
  userAgent: string
  location?: string
  timestamp: string
}

export interface UserStats {
  totalOrders: number
  totalSpent: number
  businessProfileViews: number
  lastLoginAt: string
  accountAge: number
  verificationStatus: {
    email: boolean
    phone: boolean
    business: boolean
    identity: boolean
  }
  subscriptionInfo: {
    plan: string
    status: string
    expiresAt?: string
    features: string[]
  }
}

export interface UserDocument {
  id: string
  type: "pan" | "aadhar" | "gst" | "business_license" | "bank_statement" | "other"
  name: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  status: "pending" | "verified" | "rejected"
  uploadedAt: string
  verifiedAt?: string
  rejectionReason?: string
  expiresAt?: string
}

export interface UserNotificationSettings {
  channels: {
    email: boolean
    sms: boolean
    push: boolean
    whatsapp: boolean
  }
  categories: {
    orders: boolean
    payments: boolean
    marketing: boolean
    security: boolean
    business: boolean
    system: boolean
  }
  frequency: {
    immediate: boolean
    daily: boolean
    weekly: boolean
    monthly: boolean
  }
  quietHours: {
    enabled: boolean
    startTime: string
    endTime: string
    timezone: string
  }
}

// User Service Class
class UserService {
  private readonly baseUrl = "/users"

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId?: string): Promise<ApiResponse<User>> {
    try {
      const endpoint = userId ? `${this.baseUrl}/${userId}` : `${this.baseUrl}/me`
      return await apiClient.get<User>(endpoint)
    } catch (error) {
      console.error("Get user profile error:", error)
      throw error
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UserProfileUpdate): Promise<ApiResponse<User>> {
    try {
      const formData = new FormData()

      // Handle file upload
      if (data.profilePicture) {
        formData.append("profilePicture", data.profilePicture)
      }

      // Add other fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "profilePicture" && value !== undefined) {
          if (typeof value === "object") {
            formData.append(key, JSON.stringify(value))
          } else {
            formData.append(key, String(value))
          }
        }
      })

      const response = await apiClient.put<User>(`${this.baseUrl}/me`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

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
   * Upload profile picture
   */
  async uploadProfilePicture(file: File): Promise<ApiResponse<{ profilePictureUrl: string }>> {
    try {
      const formData = new FormData()
      formData.append("profilePicture", file)

      return await apiClient.post(`${this.baseUrl}/me/avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    } catch (error) {
      console.error("Upload profile picture error:", error)
      throw error
    }
  }

  /**
   * Delete profile picture
   */
  async deleteProfilePicture(): Promise<ApiResponse<void>> {
    try {
      return await apiClient.delete(`${this.baseUrl}/me/avatar`)
    } catch (error) {
      console.error("Delete profile picture error:", error)
      throw error
    }
  }

  /**
   * Get user addresses
   */
  async getAddresses(): Promise<ApiResponse<UserAddress[]>> {
    try {
      return await apiClient.get<UserAddress[]>(`${this.baseUrl}/me/addresses`)
    } catch (error) {
      console.error("Get addresses error:", error)
      throw error
    }
  }

  /**
   * Add new address
   */
  async addAddress(address: Omit<UserAddress, "id">): Promise<ApiResponse<UserAddress>> {
    try {
      return await apiClient.post<UserAddress>(`${this.baseUrl}/me/addresses`, address)
    } catch (error) {
      console.error("Add address error:", error)
      throw error
    }
  }

  /**
   * Update address
   */
  async updateAddress(addressId: string, address: Partial<UserAddress>): Promise<ApiResponse<UserAddress>> {
    try {
      return await apiClient.put<UserAddress>(`${this.baseUrl}/me/addresses/${addressId}`, address)
    } catch (error) {
      console.error("Update address error:", error)
      throw error
    }
  }

  /**
   * Delete address
   */
  async deleteAddress(addressId: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.delete(`${this.baseUrl}/me/addresses/${addressId}`)
    } catch (error) {
      console.error("Delete address error:", error)
      throw error
    }
  }

  /**
   * Set default address
   */
  async setDefaultAddress(addressId: string, type: UserAddress["type"]): Promise<ApiResponse<void>> {
    try {
      return await apiClient.put(`${this.baseUrl}/me/addresses/${addressId}/default`, { type })
    } catch (error) {
      console.error("Set default address error:", error)
      throw error
    }
  }

  /**
   * Get user preferences
   */
  async getPreferences(): Promise<ApiResponse<UserPreferences>> {
    try {
      return await apiClient.get<UserPreferences>(`${this.baseUrl}/me/preferences`)
    } catch (error) {
      console.error("Get preferences error:", error)
      throw error
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(preferences: Partial<UserPreferences>): Promise<ApiResponse<UserPreferences>> {
    try {
      return await apiClient.put<UserPreferences>(`${this.baseUrl}/me/preferences`, preferences)
    } catch (error) {
      console.error("Update preferences error:", error)
      throw error
    }
  }

  /**
   * Get user activity log
   */
  async getActivity(params?: {
    page?: number
    limit?: number
    type?: UserActivity["type"]
    startDate?: string
    endDate?: string
  }): Promise<ApiResponse<{ activities: UserActivity[]; total: number; page: number; totalPages: number }>> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append("page", String(params.page))
      if (params?.limit) queryParams.append("limit", String(params.limit))
      if (params?.type) queryParams.append("type", params.type)
      if (params?.startDate) queryParams.append("startDate", params.startDate)
      if (params?.endDate) queryParams.append("endDate", params.endDate)

      const query = queryParams.toString()
      const endpoint = `${this.baseUrl}/me/activity${query ? `?${query}` : ""}`

      return await apiClient.get(endpoint)
    } catch (error) {
      console.error("Get activity error:", error)
      throw error
    }
  }

  /**
   * Get user statistics
   */
  async getStats(): Promise<ApiResponse<UserStats>> {
    try {
      return await apiClient.get<UserStats>(`${this.baseUrl}/me/stats`)
    } catch (error) {
      console.error("Get stats error:", error)
      throw error
    }
  }

  /**
   * Get user documents
   */
  async getDocuments(): Promise<ApiResponse<UserDocument[]>> {
    try {
      return await apiClient.get<UserDocument[]>(`${this.baseUrl}/me/documents`)
    } catch (error) {
      console.error("Get documents error:", error)
      throw error
    }
  }

  /**
   * Upload document
   */
  async uploadDocument(
    file: File,
    type: UserDocument["type"],
    metadata?: Record<string, any>,
  ): Promise<ApiResponse<UserDocument>> {
    try {
      const formData = new FormData()
      formData.append("document", file)
      formData.append("type", type)
      if (metadata) {
        formData.append("metadata", JSON.stringify(metadata))
      }

      return await apiClient.post<UserDocument>(`${this.baseUrl}/me/documents`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    } catch (error) {
      console.error("Upload document error:", error)
      throw error
    }
  }

  /**
   * Delete document
   */
  async deleteDocument(documentId: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.delete(`${this.baseUrl}/me/documents/${documentId}`)
    } catch (error) {
      console.error("Delete document error:", error)
      throw error
    }
  }

  /**
   * Get notification settings
   */
  async getNotificationSettings(): Promise<ApiResponse<UserNotificationSettings>> {
    try {
      return await apiClient.get<UserNotificationSettings>(`${this.baseUrl}/me/notifications/settings`)
    } catch (error) {
      console.error("Get notification settings error:", error)
      throw error
    }
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(
    settings: Partial<UserNotificationSettings>,
  ): Promise<ApiResponse<UserNotificationSettings>> {
    try {
      return await apiClient.put<UserNotificationSettings>(`${this.baseUrl}/me/notifications/settings`, settings)
    } catch (error) {
      console.error("Update notification settings error:", error)
      throw error
    }
  }

  /**
   * Verify phone number
   */
  async verifyPhone(phoneNumber: string): Promise<ApiResponse<{ verificationId: string }>> {
    try {
      return await apiClient.post(`${this.baseUrl}/me/verify-phone`, { phoneNumber })
    } catch (error) {
      console.error("Verify phone error:", error)
      throw error
    }
  }

  /**
   * Confirm phone verification
   */
  async confirmPhoneVerification(verificationId: string, code: string): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.post<User>(`${this.baseUrl}/me/verify-phone/confirm`, {
        verificationId,
        code,
      })

      // Update stored user data
      if (response.success && response.data) {
        localStorage.setItem("user_data", JSON.stringify(response.data))
      }

      return response
    } catch (error) {
      console.error("Confirm phone verification error:", error)
      throw error
    }
  }

  /**
   * Request account deletion
   */
  async requestAccountDeletion(reason?: string, password?: string): Promise<ApiResponse<{ deletionId: string }>> {
    try {
      return await apiClient.post(`${this.baseUrl}/me/delete-request`, { reason, password })
    } catch (error) {
      console.error("Request account deletion error:", error)
      throw error
    }
  }

  /**
   * Cancel account deletion
   */
  async cancelAccountDeletion(deletionId: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.post(`${this.baseUrl}/me/delete-request/${deletionId}/cancel`)
    } catch (error) {
      console.error("Cancel account deletion error:", error)
      throw error
    }
  }

  /**
   * Export user data
   */
  async exportUserData(format: "json" | "csv" = "json"): Promise<ApiResponse<{ downloadUrl: string }>> {
    try {
      return await apiClient.post(`${this.baseUrl}/me/export`, { format })
    } catch (error) {
      console.error("Export user data error:", error)
      throw error
    }
  }

  /**
   * Get business profile for user
   */
  async getBusinessProfile(): Promise<ApiResponse<BusinessProfile>> {
    try {
      return await apiClient.get<BusinessProfile>(`${this.baseUrl}/me/business`)
    } catch (error) {
      console.error("Get business profile error:", error)
      throw error
    }
  }

  /**
   * Search users (for admin/business purposes)
   */
  async searchUsers(params: {
    query?: string
    role?: string
    status?: string
    businessType?: string
    location?: string
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: "asc" | "desc"
  }): Promise<ApiResponse<{ users: User[]; total: number; page: number; totalPages: number }>> {
    try {
      const queryParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value))
        }
      })

      const query = queryParams.toString()
      const endpoint = `${this.baseUrl}/search${query ? `?${query}` : ""}`

      return await apiClient.get(endpoint)
    } catch (error) {
      console.error("Search users error:", error)
      throw error
    }
  }

  /**
   * Follow/Unfollow user (for business networking)
   */
  async followUser(userId: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.post(`${this.baseUrl}/${userId}/follow`)
    } catch (error) {
      console.error("Follow user error:", error)
      throw error
    }
  }

  async unfollowUser(userId: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.delete(`${this.baseUrl}/${userId}/follow`)
    } catch (error) {
      console.error("Unfollow user error:", error)
      throw error
    }
  }

  /**
   * Get user followers/following
   */
  async getFollowers(userId?: string, page = 1, limit = 20): Promise<ApiResponse<{ users: User[]; total: number }>> {
    try {
      const endpoint = userId ? `${this.baseUrl}/${userId}/followers` : `${this.baseUrl}/me/followers`
      return await apiClient.get(`${endpoint}?page=${page}&limit=${limit}`)
    } catch (error) {
      console.error("Get followers error:", error)
      throw error
    }
  }

  async getFollowing(userId?: string, page = 1, limit = 20): Promise<ApiResponse<{ users: User[]; total: number }>> {
    try {
      const endpoint = userId ? `${this.baseUrl}/${userId}/following` : `${this.baseUrl}/me/following`
      return await apiClient.get(`${endpoint}?page=${page}&limit=${limit}`)
    } catch (error) {
      console.error("Get following error:", error)
      throw error
    }
  }

  /**
   * Block/Unblock user
   */
  async blockUser(userId: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.post(`${this.baseUrl}/${userId}/block`)
    } catch (error) {
      console.error("Block user error:", error)
      throw error
    }
  }

  async unblockUser(userId: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.delete(`${this.baseUrl}/${userId}/block`)
    } catch (error) {
      console.error("Unblock user error:", error)
      throw error
    }
  }

  /**
   * Report user
   */
  async reportUser(
    userId: string,
    reason: string,
    description?: string,
    evidence?: File[],
  ): Promise<ApiResponse<{ reportId: string }>> {
    try {
      const formData = new FormData()
      formData.append("reason", reason)
      if (description) formData.append("description", description)

      if (evidence) {
        evidence.forEach((file, index) => {
          formData.append(`evidence_${index}`, file)
        })
      }

      return await apiClient.post(`${this.baseUrl}/${userId}/report`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    } catch (error) {
      console.error("Report user error:", error)
      throw error
    }
  }
}

// Create singleton instance
const userService = new UserService()

export default userService

// Export types
export type {
  UserProfileUpdate,
  UserAddress,
  UserPreferences,
  UserActivity,
  UserStats,
  UserDocument,
  UserNotificationSettings,
}
