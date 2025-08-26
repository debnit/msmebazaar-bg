"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api, type ApiResponse } from "./api-client"
import type { User } from "@/types/user"

// Types for buyer service
export interface BuyerProfile {
  id: string
  userId: string
  buyerName: string
  companyName?: string
  industry: string
  location: string
  contactPreferences: string[]
  createdAt: string
  updatedAt: string
}

export interface MSMEListing {
  id: string
  msmeId: string
  msmeName: string
  businessType: string
  industry: string
  location: string
  description: string
  annualRevenue: number
  employeeCount: number
  establishedYear: number
  status: 'ACTIVE' | 'INACTIVE' | 'SOLD'
  createdAt: string
  updatedAt: string
}

export interface SearchFilters {
  industry?: string
  location?: string
  minRevenue?: number
  maxRevenue?: number
  businessType?: string
  establishedYear?: number
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  read: boolean
}

export interface SavedSearch {
  id: string
  name: string
  filters: SearchFilters
  createdAt: string
}

export interface BuyerAnalytics {
  totalListingsViewed: number
  totalMessagesSent: number
  savedSearches: number
  favoriteListings: number
  monthlyActivity: Array<{
    month: string
    views: number
    messages: number
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

class BuyerApiService {
  // Profile Management
  async getBuyerProfile() {
    return api.get<BuyerProfile>("/buyer/profile")
  }

  async updateBuyerProfile(data: Partial<BuyerProfile>) {
    return api.put<BuyerProfile>("/buyer/profile", data)
  }

  // MSME Listings
  async browseListings(filters?: SearchFilters) {
    return api.get<MSMEListing[]>("/buyer/listings", filters)
  }

  async getListingDetails(listingId: string) {
    return api.get<MSMEListing>(`/buyer/listings/${listingId}`)
  }

  async searchMSMEs(query: string, filters?: SearchFilters) {
    return api.get<MSMEListing[]>("/buyer/search", { query, ...filters })
  }

  async getAdvancedSearch(filters: SearchFilters) {
    return api.get<MSMEListing[]>("/buyer/search/advanced", filters)
  }

  // Messaging
  async contactSeller(sellerId: string, message: string) {
    return api.post("/buyer/contact", { sellerId, message })
  }

  async getMessageHistory(sellerId: string) {
    return api.get<Message[]>(`/buyer/messages/${sellerId}`)
  }

  async sendMessage(sellerId: string, content: string) {
    return api.post(`/buyer/messages/${sellerId}`, { content })
  }

  // Saved Searches (Pro feature)
  async getSavedSearches() {
    return api.get<SavedSearch[]>("/buyer/saved-searches")
  }

  async saveSearch(name: string, filters: SearchFilters) {
    return api.post<SavedSearch>("/buyer/saved-searches", { name, filters })
  }

  async deleteSavedSearch(searchId: string) {
    return api.delete(`/buyer/saved-searches/${searchId}`)
  }

  // Analytics (Pro feature)
  async getBuyerAnalytics() {
    return api.get<BuyerAnalytics>("/buyer/analytics")
  }

  async getBasicAnalytics() {
    return api.get<BuyerAnalytics>("/buyer/analytics/basic")
  }
}

export const buyerApiService = new BuyerApiService()

// ---------------------------------------------------------
// 🔹 React Query Hooks
// ---------------------------------------------------------

export function useBuyerProfile() {
  return useQuery({
    queryKey: ["buyer", "profile"],
    queryFn: async () => {
      const resp = await buyerApiService.getBuyerProfile()
      return resp.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUpdateBuyerProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<BuyerProfile>) => buyerApiService.updateBuyerProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buyer", "profile"] })
    },
    onError: (error) => {
      console.error("Profile update failed:", handleApiError(error))
    },
  })
}

export function useBrowseListings(filters?: SearchFilters) {
  return useQuery({
    queryKey: ["buyer", "listings", filters],
    queryFn: async () => {
      const resp = await buyerApiService.browseListings(filters)
      return resp.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useListingDetails(listingId: string) {
  return useQuery({
    queryKey: ["buyer", "listing", listingId],
    queryFn: async () => {
      const resp = await buyerApiService.getListingDetails(listingId)
      return resp.data
    },
    enabled: !!listingId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useSearchMSMEs(query: string, filters?: SearchFilters) {
  return useQuery({
    queryKey: ["buyer", "search", query, filters],
    queryFn: async () => {
      const resp = await buyerApiService.searchMSMEs(query, filters)
      return resp.data
    },
    enabled: !!query,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export function useAdvancedSearch(filters: SearchFilters) {
  return useQuery({
    queryKey: ["buyer", "advanced-search", filters],
    queryFn: async () => {
      const resp = await buyerApiService.getAdvancedSearch(filters)
      return resp.data
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export function useContactSeller() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ sellerId, message }: { sellerId: string; message: string }) =>
      buyerApiService.contactSeller(sellerId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buyer", "messages"] })
    },
    onError: (error) => {
      console.error("Contact seller failed:", handleApiError(error))
    },
  })
}

export function useMessageHistory(sellerId: string) {
  return useQuery({
    queryKey: ["buyer", "messages", sellerId],
    queryFn: async () => {
      const resp = await buyerApiService.getMessageHistory(sellerId)
      return resp.data
    },
    enabled: !!sellerId,
    staleTime: 30 * 1000, // 30 seconds
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ sellerId, content }: { sellerId: string; content: string }) =>
      buyerApiService.sendMessage(sellerId, content),
    onSuccess: (_, { sellerId }) => {
      queryClient.invalidateQueries({ queryKey: ["buyer", "messages", sellerId] })
    },
    onError: (error) => {
      console.error("Send message failed:", handleApiError(error))
    },
  })
}

export function useSavedSearches() {
  return useQuery({
    queryKey: ["buyer", "saved-searches"],
    queryFn: async () => {
      const resp = await buyerApiService.getSavedSearches()
      return resp.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useSaveSearch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ name, filters }: { name: string; filters: SearchFilters }) =>
      buyerApiService.saveSearch(name, filters),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buyer", "saved-searches"] })
    },
    onError: (error) => {
      console.error("Save search failed:", handleApiError(error))
    },
  })
}

export function useDeleteSavedSearch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (searchId: string) => buyerApiService.deleteSavedSearch(searchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buyer", "saved-searches"] })
    },
    onError: (error) => {
      console.error("Delete saved search failed:", handleApiError(error))
    },
  })
}

export function useBuyerAnalytics() {
  return useQuery({
    queryKey: ["buyer", "analytics"],
    queryFn: async () => {
      const resp = await buyerApiService.getBuyerAnalytics()
      return resp.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useBasicAnalytics() {
  return useQuery({
    queryKey: ["buyer", "analytics", "basic"],
    queryFn: async () => {
      const resp = await buyerApiService.getBasicAnalytics()
      return resp.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
