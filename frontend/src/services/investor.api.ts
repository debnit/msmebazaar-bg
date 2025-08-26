"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api, type ApiResponse } from "./api-client"
import type { User } from "@/types/user"

// Types for investor service
export interface InvestorProfile {
  id: string
  userId: string
  investorName: string
  investmentFocus: string[]
  investmentRange: {
    min: number
    max: number
  }
  preferredIndustries: string[]
  experience: number
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED'
  totalInvestments: number
  totalAmountInvested: number
  averageReturn: number
  createdAt: string
  updatedAt: string
}

export interface InvestmentOpportunity {
  id: string
  msmeId: string
  msmeName: string
  businessType: string
  industry: string
  location: string
  investmentAmount: number
  equityOffered: number
  valuation: number
  description: string
  financialMetrics: {
    annualRevenue: number
    profitMargin: number
    growthRate: number
    debtToEquity: number
  }
  status: 'OPEN' | 'CLOSED' | 'FUNDED' | 'EXPIRED'
  isEarlyAccess: boolean
  createdAt: string
  updatedAt: string
  expiresAt: string
}

export interface Investment {
  id: string
  investorId: string
  opportunityId: string
  amount: number
  equityPercentage: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
  notes: string
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface InvestorAnalytics {
  totalOpportunities: number
  viewedOpportunities: number
  investedOpportunities: number
  totalAmountInvested: number
  averageReturn: number
  portfolioValue: number
  investmentHistory: Array<{
    month: string
    investments: number
    amount: number
    returns: number
  }>
  topPerformers: Array<{
    opportunityId: string
    msmeName: string
    return: number
    amount: number
  }>
}

export interface DirectChat {
  id: string
  investorId: string
  msmeId: string
  msmeName: string
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  status: 'ACTIVE' | 'ARCHIVED'
}

export interface SearchFilters {
  industry?: string
  location?: string
  minAmount?: number
  maxAmount?: number
  businessType?: string
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

class InvestorApiService {
  // Profile Management
  async getInvestorProfile() {
    return api.get<InvestorProfile>("/investor/profile")
  }

  async updateInvestorProfile(data: Partial<InvestorProfile>) {
    return api.put<InvestorProfile>("/investor/profile", data)
  }

  // Opportunity Browsing
  async browseOpportunities(filters?: SearchFilters) {
    return api.get<InvestmentOpportunity[]>("/investor/opportunities", filters)
  }

  async getEarlyAccessOpportunities() {
    return api.get<InvestmentOpportunity[]>("/investor/opportunities/early-access")
  }

  async getOpportunityDetails(opportunityId: string) {
    return api.get<InvestmentOpportunity>(`/investor/opportunities/${opportunityId}`)
  }

  // Investment Management
  async expressInterest(opportunityId: string, amount: number, notes?: string) {
    return api.post(`/investor/opportunities/${opportunityId}/interest`, { amount, notes })
  }

  async getInvestmentHistory() {
    return api.get<Investment[]>("/investor/investments")
  }

  // Analytics
  async getInvestorAnalytics() {
    return api.get<InvestorAnalytics>("/investor/analytics")
  }

  // Direct Communication (Pro feature)
  async getDirectChats() {
    return api.get<DirectChat[]>("/investor/chats")
  }
}

export const investorApiService = new InvestorApiService()

// ---------------------------------------------------------
// 🔹 React Query Hooks
// ---------------------------------------------------------

export function useInvestorProfile() {
  return useQuery({
    queryKey: ["investor", "profile"],
    queryFn: async () => {
      const resp = await investorApiService.getInvestorProfile()
      return resp.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUpdateInvestorProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<InvestorProfile>) => investorApiService.updateInvestorProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investor", "profile"] })
    },
    onError: (error) => {
      console.error("Profile update failed:", handleApiError(error))
    },
  })
}

export function useBrowseOpportunities(filters?: SearchFilters) {
  return useQuery({
    queryKey: ["investor", "opportunities", filters],
    queryFn: async () => {
      const resp = await investorApiService.browseOpportunities(filters)
      return resp.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useEarlyAccessOpportunities() {
  return useQuery({
    queryKey: ["investor", "opportunities", "early-access"],
    queryFn: async () => {
      const resp = await investorApiService.getEarlyAccessOpportunities()
      return resp.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useOpportunityDetails(opportunityId: string) {
  return useQuery({
    queryKey: ["investor", "opportunity", opportunityId],
    queryFn: async () => {
      const resp = await investorApiService.getOpportunityDetails(opportunityId)
      return resp.data
    },
    enabled: !!opportunityId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useExpressInterest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ opportunityId, amount, notes }: { opportunityId: string; amount: number; notes?: string }) =>
      investorApiService.expressInterest(opportunityId, amount, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investor", "investments"] })
    },
    onError: (error) => {
      console.error("Express interest failed:", handleApiError(error))
    },
  })
}

export function useInvestmentHistory() {
  return useQuery({
    queryKey: ["investor", "investments"],
    queryFn: async () => {
      const resp = await investorApiService.getInvestmentHistory()
      return resp.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useInvestorAnalytics() {
  return useQuery({
    queryKey: ["investor", "analytics"],
    queryFn: async () => {
      const resp = await investorApiService.getInvestorAnalytics()
      return resp.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useDirectChats() {
  return useQuery({
    queryKey: ["investor", "chats"],
    queryFn: async () => {
      const resp = await investorApiService.getDirectChats()
      return resp.data
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}
