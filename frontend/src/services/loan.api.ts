"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api, type ApiResponse } from "./api-client"
import type { User } from "@/types/user"

// Types for loan service
export interface LoanApplication {
  id: string
  userId: string
  businessName: string
  businessType: string
  industry: string
  annualRevenue: number
  loanAmount: number
  purpose: string
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'DISBURSED'
  documents: LoanDocument[]
  createdAt: string
  updatedAt: string
  submittedAt?: string
  approvedAt?: string
  disbursedAt?: string
}

export interface LoanDocument {
  id: string
  applicationId: string
  type: 'BUSINESS_PLAN' | 'FINANCIAL_STATEMENTS' | 'BANK_STATEMENTS' | 'GST_CERTIFICATE' | 'PAN_CARD' | 'AADHAR_CARD'
  fileName: string
  fileUrl: string
  uploadedAt: string
}

export interface LoanOffer {
  id: string
  applicationId: string
  lenderId: string
  lenderName: string
  loanAmount: number
  interestRate: number
  tenure: number
  monthlyEMI: number
  processingFee: number
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'
  validUntil: string
  createdAt: string
}

export interface BusinessValuation {
  id: string
  applicationId: string
  valuationAmount: number
  methodology: string
  factors: string[]
  confidence: number
  createdAt: string
}

export interface LoanEligibility {
  eligible: boolean
  maxLoanAmount: number
  recommendedAmount: number
  factors: string[]
  score: number
  requirements: string[]
}

export interface LoanAnalytics {
  totalApplications: number
  approvedApplications: number
  totalLoanAmount: number
  averageProcessingTime: number
  approvalRate: number
  monthlyStats: Array<{
    month: string
    applications: number
    approvals: number
    amount: number
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

class LoanApiService {
  // Loan Applications
  async createLoanApplication(data: Partial<LoanApplication>) {
    return api.post<LoanApplication>("/loans/applications", data)
  }

  async getLoanApplications(page: number = 1, limit: number = 20) {
    return api.get<{ applications: LoanApplication[]; pagination: any }>("/loans/applications", { page, limit })
  }

  async getLoanApplication(applicationId: string) {
    return api.get<LoanApplication>(`/loans/applications/${applicationId}`)
  }

  async updateLoanApplication(applicationId: string, data: Partial<LoanApplication>) {
    return api.put<LoanApplication>(`/loans/applications/${applicationId}`, data)
  }

  async submitLoanApplication(applicationId: string) {
    return api.post(`/loans/applications/${applicationId}/submit`)
  }

  // Document Management
  async uploadDocument(applicationId: string, type: string, file: File) {
    return api.upload(`/loans/applications/${applicationId}/documents`, file, { type })
  }

  async getDocuments(applicationId: string) {
    return api.get<LoanDocument[]>(`/loans/applications/${applicationId}/documents`)
  }

  // Loan Offers
  async getLoanOffers(applicationId: string) {
    return api.get<LoanOffer[]>(`/loans/applications/${applicationId}/offers`)
  }

  async acceptLoanOffer(offerId: string) {
    return api.post(`/loans/offers/${offerId}/accept`)
  }

  async rejectLoanOffer(offerId: string, reason?: string) {
    return api.post(`/loans/offers/${offerId}/reject`, { reason })
  }

  // Business Valuation (Pro feature)
  async getBusinessValuation(applicationId: string) {
    return api.get<BusinessValuation>(`/loans/applications/${applicationId}/valuation`)
  }

  // Eligibility Check
  async checkEligibility(data: any) {
    return api.post<LoanEligibility>("/loans/eligibility", data)
  }

  // Analytics
  async getLoanAnalytics() {
    return api.get<LoanAnalytics>("/loans/analytics")
  }

  async getBasicAnalytics() {
    return api.get<LoanAnalytics>("/loans/analytics/basic")
  }
}

export const loanApiService = new LoanApiService()

// ---------------------------------------------------------
// 🔹 React Query Hooks
// ---------------------------------------------------------

export function useLoanApplications(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ["loans", "applications", page, limit],
    queryFn: async () => {
      const resp = await loanApiService.getLoanApplications(page, limit)
      return resp.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useLoanApplication(applicationId: string) {
  return useQuery({
    queryKey: ["loans", "application", applicationId],
    queryFn: async () => {
      const resp = await loanApiService.getLoanApplication(applicationId)
      return resp.data
    },
    enabled: !!applicationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateLoanApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<LoanApplication>) => loanApiService.createLoanApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans", "applications"] })
    },
    onError: (error) => {
      console.error("Create loan application failed:", handleApiError(error))
    },
  })
}

export function useUpdateLoanApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ applicationId, data }: { applicationId: string; data: Partial<LoanApplication> }) =>
      loanApiService.updateLoanApplication(applicationId, data),
    onSuccess: (_, { applicationId }) => {
      queryClient.invalidateQueries({ queryKey: ["loans", "applications"] })
      queryClient.invalidateQueries({ queryKey: ["loans", "application", applicationId] })
    },
    onError: (error) => {
      console.error("Update loan application failed:", handleApiError(error))
    },
  })
}

export function useSubmitLoanApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (applicationId: string) => loanApiService.submitLoanApplication(applicationId),
    onSuccess: (_, applicationId) => {
      queryClient.invalidateQueries({ queryKey: ["loans", "applications"] })
      queryClient.invalidateQueries({ queryKey: ["loans", "application", applicationId] })
    },
    onError: (error) => {
      console.error("Submit loan application failed:", handleApiError(error))
    },
  })
}

export function useUploadDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ applicationId, type, file }: { applicationId: string; type: string; file: File }) =>
      loanApiService.uploadDocument(applicationId, type, file),
    onSuccess: (_, { applicationId }) => {
      queryClient.invalidateQueries({ queryKey: ["loans", "application", applicationId, "documents"] })
    },
    onError: (error) => {
      console.error("Upload document failed:", handleApiError(error))
    },
  })
}

export function useDocuments(applicationId: string) {
  return useQuery({
    queryKey: ["loans", "application", applicationId, "documents"],
    queryFn: async () => {
      const resp = await loanApiService.getDocuments(applicationId)
      return resp.data
    },
    enabled: !!applicationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useLoanOffers(applicationId: string) {
  return useQuery({
    queryKey: ["loans", "application", applicationId, "offers"],
    queryFn: async () => {
      const resp = await loanApiService.getLoanOffers(applicationId)
      return resp.data
    },
    enabled: !!applicationId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useAcceptLoanOffer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (offerId: string) => loanApiService.acceptLoanOffer(offerId),
    onSuccess: (_, offerId) => {
      queryClient.invalidateQueries({ queryKey: ["loans", "offers"] })
    },
    onError: (error) => {
      console.error("Accept loan offer failed:", handleApiError(error))
    },
  })
}

export function useRejectLoanOffer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ offerId, reason }: { offerId: string; reason?: string }) =>
      loanApiService.rejectLoanOffer(offerId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans", "offers"] })
    },
    onError: (error) => {
      console.error("Reject loan offer failed:", handleApiError(error))
    },
  })
}

export function useBusinessValuation(applicationId: string) {
  return useQuery({
    queryKey: ["loans", "application", applicationId, "valuation"],
    queryFn: async () => {
      const resp = await loanApiService.getBusinessValuation(applicationId)
      return resp.data
    },
    enabled: !!applicationId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useCheckEligibility() {
  return useMutation({
    mutationFn: (data: any) => loanApiService.checkEligibility(data),
    onError: (error) => {
      console.error("Check eligibility failed:", handleApiError(error))
    },
  })
}

export function useLoanAnalytics() {
  return useQuery({
    queryKey: ["loans", "analytics"],
    queryFn: async () => {
      const resp = await loanApiService.getLoanAnalytics()
      return resp.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useBasicAnalytics() {
  return useQuery({
    queryKey: ["loans", "analytics", "basic"],
    queryFn: async () => {
      const resp = await loanApiService.getBasicAnalytics()
      return resp.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
