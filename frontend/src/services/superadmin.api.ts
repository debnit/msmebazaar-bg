"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api, type ApiResponse } from "./api-client"
import type { User } from "@/types/user"

// Types for superadmin service
export interface SystemWideAnalytics {
  totalUsers: number
  activeUsers: number
  proUsers: number
  totalRevenue: number
  monthlyGrowth: number
  systemUptime: number
  averageResponseTime: number
  errorRate: number
  userDistribution: {
    buyers: number
    sellers: number
    agents: number
    msmeOwners: number
    investors: number
    admins: number
    superAdmins: number
  }
  revenueTrends: Array<{
    month: string
    revenue: number
    newUsers: number
    proConversions: number
  }>
  systemMetrics: {
    cpuUsage: number
    memoryUsage: number
    diskUsage: number
    networkTraffic: number
  }
}

export interface UserRoleManagement {
  id: string
  email: string
  name: string
  currentRoles: string[]
  availableRoles: string[]
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED'
  createdAt: string
  lastLoginAt?: string
}

export interface SystemConfiguration {
  id: string
  key: string
  value: string
  description: string
  category: 'SECURITY' | 'PERFORMANCE' | 'FEATURES' | 'INTEGRATIONS'
  isEncrypted: boolean
  updatedBy: string
  updatedAt: string
}

export interface AuditLog {
  id: string
  userId: string
  action: string
  resource: string
  resourceId: string
  details: any
  ipAddress: string
  userAgent: string
  timestamp: string
}

export interface SystemHealthOverview {
  overallStatus: 'HEALTHY' | 'DEGRADED' | 'DOWN'
  services: Array<{
    name: string
    status: 'HEALTHY' | 'DEGRADED' | 'DOWN'
    uptime: number
    responseTime: number
  }>
  infrastructure: {
    database: { status: string; connections: number; queriesPerSecond: number }
    cache: { status: string; hitRate: number; memoryUsage: number }
    loadBalancer: { status: string; requestsPerSecond: number }
    storage: { status: string; usage: number; available: number }
  }
  alerts: Array<{
    level: 'INFO' | 'WARNING' | 'ERROR'
    message: string
    timestamp: string
  }>
}

export interface SuperAdminData {
  email: string
  name: string
  password: string
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

class SuperAdminApiService {
  // Dashboard
  async getDashboardSummary() {
    return api.get<DashboardSummary>("/superadmin/dashboard")
  }

  // System-wide Analytics
  async getSystemWideAnalytics() {
    return api.get<SystemWideAnalytics>("/superadmin/analytics")
  }

  // User Role Management
  async getUserRoleManagement(page: number = 1, limit: number = 20) {
    return api.get<{ users: UserRoleManagement[]; pagination: any }>("/superadmin/users/roles", { page, limit })
  }

  async updateUserRoles(userId: string, roles: string[]) {
    return api.put(`/superadmin/users/${userId}/roles`, { roles })
  }

  // System Configuration
  async getSystemConfiguration() {
    return api.get<SystemConfiguration[]>("/superadmin/configuration")
  }

  async updateSystemConfiguration(configId: string, value: string) {
    return api.put(`/superadmin/configuration/${configId}`, { value })
  }

  // System Monitoring
  async getSystemHealthOverview() {
    return api.get<SystemHealthOverview>("/superadmin/health")
  }

  async getAuditLogs(page: number = 1, limit: number = 50) {
    return api.get<{ auditLogs: AuditLog[]; pagination: any }>("/superadmin/audit-logs", { page, limit })
  }

  // Super Admin Management
  async createSuperAdmin(data: SuperAdminData) {
    return api.post("/superadmin/admins", data)
  }
}

export const superAdminApiService = new SuperAdminApiService()

// ---------------------------------------------------------
// 🔹 React Query Hooks
// ---------------------------------------------------------

export function useSuperAdminDashboard() {
  return useQuery({
    queryKey: ["superadmin", "dashboard"],
    queryFn: async () => {
      const resp = await superAdminApiService.getDashboardSummary()
      return resp.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useSystemWideAnalytics() {
  return useQuery({
    queryKey: ["superadmin", "analytics"],
    queryFn: async () => {
      const resp = await superAdminApiService.getSystemWideAnalytics()
      return resp.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUserRoleManagement(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ["superadmin", "users", "roles", page, limit],
    queryFn: async () => {
      const resp = await superAdminApiService.getUserRoleManagement(page, limit)
      return resp.data
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export function useUpdateUserRoles() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, roles }: { userId: string; roles: string[] }) =>
      superAdminApiService.updateUserRoles(userId, roles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superadmin", "users", "roles"] })
    },
    onError: (error) => {
      console.error("Update user roles failed:", handleApiError(error))
    },
  })
}

export function useSystemConfiguration() {
  return useQuery({
    queryKey: ["superadmin", "configuration"],
    queryFn: async () => {
      const resp = await superAdminApiService.getSystemConfiguration()
      return resp.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUpdateSystemConfiguration() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ configId, value }: { configId: string; value: string }) =>
      superAdminApiService.updateSystemConfiguration(configId, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superadmin", "configuration"] })
    },
    onError: (error) => {
      console.error("Update system configuration failed:", handleApiError(error))
    },
  })
}

export function useSystemHealthOverview() {
  return useQuery({
    queryKey: ["superadmin", "health"],
    queryFn: async () => {
      const resp = await superAdminApiService.getSystemHealthOverview()
      return resp.data
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })
}

export function useAuditLogs(page: number = 1, limit: number = 50) {
  return useQuery({
    queryKey: ["superadmin", "audit-logs", page, limit],
    queryFn: async () => {
      const resp = await superAdminApiService.getAuditLogs(page, limit)
      return resp.data
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export function useCreateSuperAdmin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SuperAdminData) => superAdminApiService.createSuperAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superadmin", "users", "roles"] })
    },
    onError: (error) => {
      console.error("Create super admin failed:", handleApiError(error))
    },
  })
}
