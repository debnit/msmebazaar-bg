"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api, type ApiResponse } from "./api-client"
import type { User } from "@/types/user"

// Types for admin service
export interface UserManagement {
  id: string
  email: string
  name: string
  roles: string[]
  isPro: boolean
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED'
  createdAt: string
  lastLoginAt?: string
}

export interface SystemAnalytics {
  totalUsers: number
  activeUsers: number
  proUsers: number
  totalRevenue: number
  monthlyGrowth: number
  userDistribution: {
    buyers: number
    sellers: number
    agents: number
    msmeOwners: number
    investors: number
  }
  revenueTrends: Array<{
    month: string
    revenue: number
    newUsers: number
  }>
  topPerformingFeatures: Array<{
    feature: string
    usage: number
    revenue: number
  }>
}

export interface FeatureFlag {
  id: string
  name: string
  description: string
  enabled: boolean
  proOnly: boolean
  rolesEnabled: string[]
  rolloutPercentage: number
  createdAt: string
  updatedAt: string
}

export interface SystemHealth {
  services: Array<{
    name: string
    status: 'HEALTHY' | 'DEGRADED' | 'DOWN'
    responseTime: number
    uptime: number
  }>
  database: {
    status: string
    connections: number
    queriesPerSecond: number
  }
  cache: {
    status: string
    hitRate: number
    memoryUsage: number
  }
  overallStatus: 'HEALTHY' | 'DEGRADED' | 'DOWN'
}

export interface DashboardSummary {
  totalUsers: number
  activeUsers: number
  proUsers: number
  todaySignups: number
  todayRevenue: number
  pendingApprovals: number
  conversionRate: number
}

// Central Error Handler
function handleApiError(error: any) {
  if (error?.response?.data?.message) return error.response.data.message
  if (error?.message) return error.message
  return "An unexpected error occurred"
}

// ---------------------------------------------------------
// 🔹 Service Layer
// ---------------------------------------------------------

class AdminApiService {
  // Dashboard
  async getDashboardSummary() {
    return api.get<DashboardSummary>("/admin/dashboard")
  }

  // User Management
  async getUserManagement(page: number = 1, limit: number = 20) {
    return api.get<{ users: UserManagement[]; pagination: any }>("/admin/users", { page, limit })
  }

  async updateUserStatus(userId: string, status: 'ACTIVE' | 'SUSPENDED' | 'DELETED') {
    return api.put(`/admin/users/${userId}/status`, { status })
  }

  async searchUsers(query: string, filters?: any) {
    return api.get<{ users: UserManagement[]; total: number }>("/admin/users/search", { query, ...filters })
  }

  // Analytics
  async getBasicAnalytics() {
    return api.get<SystemAnalytics>("/admin/analytics")
  }

  async getAdvancedAnalytics() {
    return api.get<SystemAnalytics>("/admin/analytics/advanced")
  }

  // Feature Flags
  async getFeatureFlags() {
    return api.get<FeatureFlag[]>("/admin/feature-flags")
  }

  async updateFeatureFlag(flagId: string, updateData: Partial<FeatureFlag>) {
    return api.put(`/admin/feature-flags/${flagId}`, updateData)
  }

  // System Health
  async getSystemHealth() {
    return api.get<SystemHealth>("/admin/system-health")
  }
}

export const adminApiService = new AdminApiService()

// ---------------------------------------------------------
// 🔹 React Query Hooks
// ---------------------------------------------------------

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const resp = await adminApiService.getDashboardSummary()
      return resp.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useUserManagement(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ["admin", "users", page, limit],
    queryFn: async () => {
      const resp = await adminApiService.getUserManagement(page, limit)
      return resp.data
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: 'ACTIVE' | 'SUSPENDED' | 'DELETED' }) =>
      adminApiService.updateUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
    },
    onError: (error) => {
      console.error("Update user status failed:", handleApiError(error))
    },
  })
}

export function useSearchUsers(query: string, filters?: any) {
  return useQuery({
    queryKey: ["admin", "users", "search", query, filters],
    queryFn: async () => {
      const resp = await adminApiService.searchUsers(query, filters)
      return resp.data
    },
    enabled: !!query,
    staleTime: 30 * 1000, // 30 seconds
  })
}

export function useBasicAnalytics() {
  return useQuery({
    queryKey: ["admin", "analytics", "basic"],
    queryFn: async () => {
      const resp = await adminApiService.getBasicAnalytics()
      return resp.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useAdvancedAnalytics() {
  return useQuery({
    queryKey: ["admin", "analytics", "advanced"],
    queryFn: async () => {
      const resp = await adminApiService.getAdvancedAnalytics()
      return resp.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useFeatureFlags() {
  return useQuery({
    queryKey: ["admin", "feature-flags"],
    queryFn: async () => {
      const resp = await adminApiService.getFeatureFlags()
      return resp.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useUpdateFeatureFlag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ flagId, updateData }: { flagId: string; updateData: Partial<FeatureFlag> }) =>
      adminApiService.updateFeatureFlag(flagId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "feature-flags"] })
    },
    onError: (error) => {
      console.error("Update feature flag failed:", handleApiError(error))
    },
  })
}

export function useSystemHealth() {
  return useQuery({
    queryKey: ["admin", "system-health"],
    queryFn: async () => {
      const resp = await adminApiService.getSystemHealth()
      return resp.data
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })
}
