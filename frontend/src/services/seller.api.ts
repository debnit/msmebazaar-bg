"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api, type ApiResponse } from "./api-client"
import type { User } from "@/types/user"

// Types for seller service
export interface SellerProfile {
  id: string
  userId: string
  sellerName: string
  companyName: string
  industry: string
  location: string
  description: string
  contactInfo: {
    email: string
    phone: string
    website?: string
  }
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED'
  createdAt: string
  updatedAt: string
}

export interface Listing {
  id: string
  sellerId: string
  title: string
  description: string
  industry: string
  location: string
  annualRevenue: number
  employeeCount: number
  establishedYear: number
  askingPrice: number
  status: 'DRAFT' | 'PUBLISHED' | 'SOLD' | 'EXPIRED'
  isFeatured: boolean
  views: number
  inquiries: number
  createdAt: string
  updatedAt: string
}

export interface ListingForm {
  title: string
  description: string
  industry: string
  location: string
  annualRevenue: number
  employeeCount: number
  establishedYear: number
  askingPrice: number
}

export interface Inquiry {
  id: string
  listingId: string
  buyerId: string
  buyerName: string
  message: string
  status: 'PENDING' | 'RESPONDED' | 'CLOSED'
  createdAt: string
  respondedAt?: string
}

export interface SellerAnalytics {
  totalListings: number
  activeListings: number
  totalViews: number
  totalInquiries: number
  averageResponseTime: number
  monthlyStats: Array<{
    month: string
    views: number
    inquiries: number
    responses: number
  }>
  topPerformingListings: Array<{
    listingId: string
    title: string
    views: number
    inquiries: number
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

class SellerApiService {
  // Profile Management
  async getSellerProfile() {
    return api.get<SellerProfile>("/seller/profile")
  }

  async updateSellerProfile(data: Partial<SellerProfile>) {
    return api.put<SellerProfile>("/seller/profile", data)
  }

  // Listing Management
  async getSellerListings() {
    return api.get<Listing[]>("/seller/listings")
  }

  async getListingDetails(listingId: string) {
    return api.get<Listing>(`/seller/listings/${listingId}`)
  }

  async createListing(data: ListingForm) {
    return api.post<Listing>("/seller/listings", data)
  }

  async updateListing(listingId: string, data: Partial<ListingForm>) {
    return api.put<Listing>(`/seller/listings/${listingId}`, data)
  }

  async deleteListing(listingId: string) {
    return api.delete(`/seller/listings/${listingId}`)
  }

  async publishListing(listingId: string) {
    return api.post(`/seller/listings/${listingId}/publish`)
  }

  async boostListing(listingId: string) {
    return api.post(`/seller/listings/${listingId}/boost`)
  }

  // Inquiry Management
  async getInquiries() {
    return api.get<Inquiry[]>("/seller/inquiries")
  }

  async getInquiryDetails(inquiryId: string) {
    return api.get<Inquiry>(`/seller/inquiries/${inquiryId}`)
  }

  async respondToInquiry(inquiryId: string, response: string) {
    return api.post(`/seller/inquiries/${inquiryId}/respond`, { response })
  }

  // Analytics
  async getSellerAnalytics() {
    return api.get<SellerAnalytics>("/seller/analytics")
  }

  async getBasicAnalytics() {
    return api.get<SellerAnalytics>("/seller/analytics/basic")
  }
}

export const sellerApiService = new SellerApiService()

// ---------------------------------------------------------
// 🔹 React Query Hooks
// ---------------------------------------------------------

export function useSellerProfile() {
  return useQuery({
    queryKey: ["seller", "profile"],
    queryFn: async () => {
      const resp = await sellerApiService.getSellerProfile()
      return resp.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUpdateSellerProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<SellerProfile>) => sellerApiService.updateSellerProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller", "profile"] })
    },
    onError: (error) => {
      console.error("Profile update failed:", handleApiError(error))
    },
  })
}

export function useSellerListings() {
  return useQuery({
    queryKey: ["seller", "listings"],
    queryFn: async () => {
      const resp = await sellerApiService.getSellerListings()
      return resp.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useListingDetails(listingId: string) {
  return useQuery({
    queryKey: ["seller", "listing", listingId],
    queryFn: async () => {
      const resp = await sellerApiService.getListingDetails(listingId)
      return resp.data
    },
    enabled: !!listingId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ListingForm) => sellerApiService.createListing(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller", "listings"] })
    },
    onError: (error) => {
      console.error("Create listing failed:", handleApiError(error))
    },
  })
}

export function useUpdateListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ listingId, data }: { listingId: string; data: Partial<ListingForm> }) =>
      sellerApiService.updateListing(listingId, data),
    onSuccess: (_, { listingId }) => {
      queryClient.invalidateQueries({ queryKey: ["seller", "listings"] })
      queryClient.invalidateQueries({ queryKey: ["seller", "listing", listingId] })
    },
    onError: (error) => {
      console.error("Update listing failed:", handleApiError(error))
    },
  })
}

export function useDeleteListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (listingId: string) => sellerApiService.deleteListing(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller", "listings"] })
    },
    onError: (error) => {
      console.error("Delete listing failed:", handleApiError(error))
    },
  })
}

export function usePublishListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (listingId: string) => sellerApiService.publishListing(listingId),
    onSuccess: (_, listingId) => {
      queryClient.invalidateQueries({ queryKey: ["seller", "listings"] })
      queryClient.invalidateQueries({ queryKey: ["seller", "listing", listingId] })
    },
    onError: (error) => {
      console.error("Publish listing failed:", handleApiError(error))
    },
  })
}

export function useBoostListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (listingId: string) => sellerApiService.boostListing(listingId),
    onSuccess: (_, listingId) => {
      queryClient.invalidateQueries({ queryKey: ["seller", "listings"] })
      queryClient.invalidateQueries({ queryKey: ["seller", "listing", listingId] })
    },
    onError: (error) => {
      console.error("Boost listing failed:", handleApiError(error))
    },
  })
}

export function useInquiries() {
  return useQuery({
    queryKey: ["seller", "inquiries"],
    queryFn: async () => {
      const resp = await sellerApiService.getInquiries()
      return resp.data
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export function useInquiryDetails(inquiryId: string) {
  return useQuery({
    queryKey: ["seller", "inquiry", inquiryId],
    queryFn: async () => {
      const resp = await sellerApiService.getInquiryDetails(inquiryId)
      return resp.data
    },
    enabled: !!inquiryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useRespondToInquiry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ inquiryId, response }: { inquiryId: string; response: string }) =>
      sellerApiService.respondToInquiry(inquiryId, response),
    onSuccess: (_, { inquiryId }) => {
      queryClient.invalidateQueries({ queryKey: ["seller", "inquiries"] })
      queryClient.invalidateQueries({ queryKey: ["seller", "inquiry", inquiryId] })
    },
    onError: (error) => {
      console.error("Respond to inquiry failed:", handleApiError(error))
    },
  })
}

export function useSellerAnalytics() {
  return useQuery({
    queryKey: ["seller", "analytics"],
    queryFn: async () => {
      const resp = await sellerApiService.getSellerAnalytics()
      return resp.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useBasicAnalytics() {
  return useQuery({
    queryKey: ["seller", "analytics", "basic"],
    queryFn: async () => {
      const resp = await sellerApiService.getBasicAnalytics()
      return resp.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
