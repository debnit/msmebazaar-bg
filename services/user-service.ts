"use client"

import apiClient, { type ApiResponse } from "@/utils/api-client"
import type {
  User,
  UserProfile,
  UserAddress,
  UserPreferences,
  UserActivity,
  UserDocument,
  UserStats,
  NotificationSettings,
} from "@/types/user"
import type { PaginatedResponse } from "@/types/api"

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

// User Service - Using object with methods instead of static class
const userService = {
  // Profile Management
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return apiClient.get("/user/profile")
  },

  async updateProfile(data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return apiClient.put("/user/profile", data)
  },

  async uploadProfilePicture(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData()
    formData.append("avatar", file)
    return apiClient.post("/user/profile/avatar", formData)
  },

  async deleteProfilePicture(): Promise<ApiResponse<void>> {
    return apiClient.delete("/user/profile/avatar")
  },

  // Address Management
  async getAddresses(): Promise<ApiResponse<UserAddress[]>> {
    return apiClient.get("/user/addresses")
  },

  async createAddress(address: Omit<UserAddress, "id" | "createdAt" | "updatedAt">): Promise<ApiResponse<UserAddress>> {
    return apiClient.post("/user/addresses", address)
  },

  async updateAddress(id: string, address: Partial<UserAddress>): Promise<ApiResponse<UserAddress>> {
    return apiClient.put(`/user/addresses/${id}`, address)
  },

  async deleteAddress(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/user/addresses/${id}`)
  },

  async setDefaultAddress(id: string): Promise<ApiResponse<void>> {
    return apiClient.patch(`/user/addresses/${id}/default`)
  },

  // User Preferences
  async getPreferences(): Promise<ApiResponse<UserPreferences>> {
    return apiClient.get("/user/preferences")
  },

  async updatePreferences(preferences: Partial<UserPreferences>): Promise<ApiResponse<UserPreferences>> {
    return apiClient.put("/user/preferences", preferences)
  },

  // Activity & History
  async getActivity(params?: {
    page?: number
    limit?: number
    type?: string
    startDate?: string
    endDate?: string
  }): Promise<ApiResponse<PaginatedResponse<UserActivity>>> {
    return apiClient.get("/user/activity", { params })
  },

  // Document Management
  async getDocuments(): Promise<ApiResponse<UserDocument[]>> {
    return apiClient.get("/user/documents")
  },

  async uploadDocument(data: {
    type: string
    file: File
    metadata?: Record<string, any>
  }): Promise<ApiResponse<UserDocument>> {
    const formData = new FormData()
    formData.append("document", data.file)
    formData.append("type", data.type)
    if (data.metadata) {
      formData.append("metadata", JSON.stringify(data.metadata))
    }
    return apiClient.post("/user/documents", formData)
  },

  async deleteDocument(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/user/documents/${id}`)
  },

  async verifyDocument(id: string): Promise<ApiResponse<UserDocument>> {
    return apiClient.post(`/user/documents/${id}/verify`)
  },

  // User Statistics
  async getStats(): Promise<ApiResponse<UserStats>> {
    return apiClient.get("/user/stats")
  },

  // Notification Settings
  async getNotificationSettings(): Promise<ApiResponse<NotificationSettings>> {
    return apiClient.get("/user/notifications/settings")
  },

  async updateNotificationSettings(
    settings: Partial<NotificationSettings>,
  ): Promise<ApiResponse<NotificationSettings>> {
    return apiClient.put("/user/notifications/settings", settings)
  },

  // Phone Verification
  async sendPhoneVerificationOTP(phone: string): Promise<ApiResponse<{ otpId: string }>> {
    return apiClient.post("/user/phone/verify/send", { phone })
  },

  async verifyPhoneOTP(otpId: string, otp: string): Promise<ApiResponse<void>> {
    return apiClient.post("/user/phone/verify/confirm", { otpId, otp })
  },

  // Account Management
  async changePassword(data: {
    currentPassword: string
    newPassword: string
  }): Promise<ApiResponse<void>> {
    return apiClient.post("/user/password/change", data)
  },

  async deleteAccount(password: string): Promise<ApiResponse<void>> {
    return apiClient.post("/user/account/delete", { password })
  },

  async exportData(): Promise<ApiResponse<{ downloadUrl: string }>> {
    return apiClient.post("/user/data/export")
  },

  // Social Features
  async followUser(userId: string): Promise<ApiResponse<void>> {
    return apiClient.post(`/user/${userId}/follow`)
  },

  async unfollowUser(userId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/user/${userId}/follow`)
  },

  async blockUser(userId: string): Promise<ApiResponse<void>> {
    return apiClient.post(`/user/${userId}/block`)
  },

  async unblockUser(userId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/user/${userId}/block`)
  },

  async reportUser(userId: string, reason: string, description?: string): Promise<ApiResponse<void>> {
    return apiClient.post(`/user/${userId}/report`, { reason, description })
  },

  // Search & Discovery
  async searchUsers(params: {
    query?: string
    location?: string
    businessType?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<PaginatedResponse<User>>> {
    return apiClient.get("/user/search", { params })
  },

  async getSuggestedUsers(limit = 10): Promise<ApiResponse<User[]>> {
    return apiClient.get("/user/suggestions", { params: { limit } })
  },

  // Business Integration
  async linkBusinessProfile(businessId: string): Promise<ApiResponse<void>> {
    return apiClient.post("/user/business/link", { businessId })
  },

  async unlinkBusinessProfile(): Promise<ApiResponse<void>> {
    return apiClient.delete("/user/business/link")
  },

  // Utility Methods
  async checkUsernameAvailability(username: string): Promise<ApiResponse<{ available: boolean }>> {
    return apiClient.get("/user/username/check", { params: { username } })
  },

  async checkEmailAvailability(email: string): Promise<ApiResponse<{ available: boolean }>> {
    return apiClient.get("/user/email/check", { params: { email } })
  },

  async checkPhoneAvailability(phone: string): Promise<ApiResponse<{ available: boolean }>> {
    return apiClient.get("/user/phone/check", { params: { phone } })
  },
}

export default userService

// Export types
export type {
  UserProfileUpdate,
  UserAddress,
  UserPreferences,
  UserActivity,
  UserDocument,
  UserStats,
  NotificationSettings,
}
