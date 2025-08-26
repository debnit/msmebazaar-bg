"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api, type ApiResponse } from "./api-client"
import type { User } from "@/types/user"

// Types for agent service
export interface AgentProfile {
  id: string
  userId: string
  agentName: string
  companyName: string
  licenseNumber: string
  specialization: string[]
  experience: number
  location: string
  contactInfo: {
    email: string
    phone: string
    website?: string
  }
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED'
  totalDeals: number
  successRate: number
  createdAt: string
  updatedAt: string
}

export interface Deal {
  id: string
  agentId: string
  buyerId: string
  sellerId: string
  buyerName: string
  sellerName: string
  dealType: 'BUY' | 'SELL' | 'PARTNERSHIP'
  status: 'INITIATED' | 'NEGOTIATING' | 'AGREED' | 'COMPLETED' | 'CANCELLED'
  value: number
  commission: number
  commissionRate: number
  description: string
  notes: string
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface DealForm {
  buyerId: string
  sellerId: string
  dealType: 'BUY' | 'SELL' | 'PARTNERSHIP'
  value: number
  description: string
  notes?: string
}

export interface Commission {
  id: string
  agentId: string
  dealId: string
  amount: number
  rate: number
  status: 'PENDING' | 'APPROVED' | 'PAID'
  dealValue: number
  dealType: string
  createdAt: string
  paidAt?: string
}

export interface AgentAnalytics {
  totalDeals: number
  activeDeals: number
  completedDeals: number
  totalCommission: number
  averageDealValue: number
  successRate: number
  monthlyStats: Array<{
    month: string
    deals: number
    commission: number
    successRate: number
  }>
  topPerformingDeals: Array<{
    dealId: string
    value: number
    commission: number
    status: string
  }>
}

export interface CRMDashboard {
  leads: number
  prospects: number
  activeDeals: number
  wonDeals: number
  lostDeals: number
  pipelineValue: number
  conversionRate: number
  recentActivities: Array<{
    id: string
    type: string
    description: string
    timestamp: string
  }>
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

class AgentApiService {
  // Profile Management
  async getAgentProfile() {
    return api.get<AgentProfile>("/agent/profile")
  }

  async updateAgentProfile(data: Partial<AgentProfile>) {
    return api.put<AgentProfile>("/agent/profile", data)
  }

  // Deal Management
  async getAgentDeals() {
    return api.get<Deal[]>("/agent/deals")
  }

  async getDealDetails(dealId: string) {
    return api.get<Deal>(`/agent/deals/${dealId}`)
  }

  async createDeal(data: DealForm) {
    return api.post<Deal>("/agent/deals", data)
  }

  async updateDealStatus(dealId: string, status: Deal['status']) {
    return api.put(`/agent/deals/${dealId}/status`, { status })
  }

  // Commission Management
  async getCommissionHistory() {
    return api.get<Commission[]>("/agent/commissions")
  }

  // Analytics
  async getAgentAnalytics() {
    return api.get<AgentAnalytics>("/agent/analytics")
  }

  async getBasicAnalytics() {
    return api.get<AgentAnalytics>("/agent/analytics/basic")
  }

  // CRM Dashboard (Pro feature)
  async getCRMDashboard() {
    return api.get<CRMDashboard>("/agent/crm")
  }
}

export const agentApiService = new AgentApiService()

// ---------------------------------------------------------
// 🔹 React Query Hooks
// ---------------------------------------------------------

export function useAgentProfile() {
  return useQuery({
    queryKey: ["agent", "profile"],
    queryFn: async () => {
      const resp = await agentApiService.getAgentProfile()
      return resp.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUpdateAgentProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<AgentProfile>) => agentApiService.updateAgentProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent", "profile"] })
    },
    onError: (error) => {
      console.error("Profile update failed:", handleApiError(error))
    },
  })
}

export function useAgentDeals() {
  return useQuery({
    queryKey: ["agent", "deals"],
    queryFn: async () => {
      const resp = await agentApiService.getAgentDeals()
      return resp.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useDealDetails(dealId: string) {
  return useQuery({
    queryKey: ["agent", "deal", dealId],
    queryFn: async () => {
      const resp = await agentApiService.getDealDetails(dealId)
      return resp.data
    },
    enabled: !!dealId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateDeal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: DealForm) => agentApiService.createDeal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent", "deals"] })
    },
    onError: (error) => {
      console.error("Create deal failed:", handleApiError(error))
    },
  })
}

export function useUpdateDealStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ dealId, status }: { dealId: string; status: Deal['status'] }) =>
      agentApiService.updateDealStatus(dealId, status),
    onSuccess: (_, { dealId }) => {
      queryClient.invalidateQueries({ queryKey: ["agent", "deals"] })
      queryClient.invalidateQueries({ queryKey: ["agent", "deal", dealId] })
    },
    onError: (error) => {
      console.error("Update deal status failed:", handleApiError(error))
    },
  })
}

export function useCommissionHistory() {
  return useQuery({
    queryKey: ["agent", "commissions"],
    queryFn: async () => {
      const resp = await agentApiService.getCommissionHistory()
      return resp.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useAgentAnalytics() {
  return useQuery({
    queryKey: ["agent", "analytics"],
    queryFn: async () => {
      const resp = await agentApiService.getAgentAnalytics()
      return resp.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useBasicAnalytics() {
  return useQuery({
    queryKey: ["agent", "analytics", "basic"],
    queryFn: async () => {
      const resp = await agentApiService.getBasicAnalytics()
      return resp.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useCRMDashboard() {
  return useQuery({
    queryKey: ["agent", "crm"],
    queryFn: async () => {
      const resp = await agentApiService.getCRMDashboard()
      return resp.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
