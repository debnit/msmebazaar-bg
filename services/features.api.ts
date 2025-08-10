"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "./api-client"

/**
 * Feature flag and service feature toggle types
 */
export interface FeatureFlag {
  id: string
  name: string
  enabled: boolean
  description?: string
  rolloutPercentage?: number
  conditions?: Record<string, any>
}

export interface ServiceFeature {
  id: string
  serviceId: string
  name: string
  enabled: boolean
  requiresPro: boolean
  allowedRoles: string[]
  description?: string
}

export interface FeatureFlagsResponse {
  flags: FeatureFlag[]
  userFeatures: ServiceFeature[]
  lastUpdated: string
}

/**
 * API client for feature flags and service features
 */
class FeaturesApiClient {
  private readonly baseUrl = "/api/features"

  /**
   * Fetch all feature flags and user-specific service features
   */
  async getFeatures(): Promise<FeatureFlagsResponse> {
    const response = await apiClient.get<FeatureFlagsResponse>(`${this.baseUrl}`)
    return response.data
  }

  /**
   * Check if a specific feature flag is enabled for the current user
   */
  async checkFeatureFlag(flagName: string): Promise<{ enabled: boolean }> {
    const response = await apiClient.get<{ enabled: boolean }>(`${this.baseUrl}/flags/${flagName}/check`)
    return response.data
  }

  /**
   * Get service features for a specific service
   */
  async getServiceFeatures(serviceId: string): Promise<ServiceFeature[]> {
    const response = await apiClient.get<ServiceFeature[]>(`${this.baseUrl}/services/${serviceId}/features`)
    return response.data
  }

  /**
   * Check access to a specific service feature
   */
  async checkServiceFeatureAccess(
    serviceId: string,
    featureId: string,
  ): Promise<{
    hasAccess: boolean
    reason?: string
    requiresUpgrade?: boolean
  }> {
    const response = await apiClient.get<{
      hasAccess: boolean
      reason?: string
      requiresUpgrade?: boolean
    }>(`${this.baseUrl}/services/${serviceId}/features/${featureId}/access`)
    return response.data
  }

  /**
   * Enable a feature for the current user (if allowed)
   */
  async enableFeature(serviceId: string, featureId: string): Promise<void> {
    await apiClient.post(`${this.baseUrl}/services/${serviceId}/features/${featureId}/enable`)
  }

  /**
   * Disable a feature for the current user
   */
  async disableFeature(serviceId: string, featureId: string): Promise<void> {
    await apiClient.post(`${this.baseUrl}/services/${serviceId}/features/${featureId}/disable`)
  }
}

export const featuresApi = new FeaturesApiClient()

/**
 * React Query hooks for feature management
 */

/**
 * Hook to fetch all feature flags and service features
 */
export function useFeatures() {
  return useQuery({
    queryKey: ["features"],
    queryFn: () => featuresApi.getFeatures(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to check a specific feature flag
 */
export function useFeatureFlag(flagName: string) {
  return useQuery({
    queryKey: ["feature-flag", flagName],
    queryFn: () => featuresApi.checkFeatureFlag(flagName),
    enabled: !!flagName,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook to get service features for a specific service
 */
export function useServiceFeatures(serviceId: string) {
  return useQuery({
    queryKey: ["service-features", serviceId],
    queryFn: () => featuresApi.getServiceFeatures(serviceId),
    enabled: !!serviceId,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook to check access to a service feature
 */
export function useServiceFeatureAccess(serviceId: string, featureId: string) {
  return useQuery({
    queryKey: ["service-feature-access", serviceId, featureId],
    queryFn: () => featuresApi.checkServiceFeatureAccess(serviceId, featureId),
    enabled: !!(serviceId && featureId),
    staleTime: 2 * 60 * 1000, // 2 minutes for access checks
  })
}

/**
 * Hook to enable a service feature
 */
export function useEnableFeature() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serviceId, featureId }: { serviceId: string; featureId: string }) =>
      featuresApi.enableFeature(serviceId, featureId),
    onSuccess: (_, { serviceId, featureId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["features"] })
      queryClient.invalidateQueries({ queryKey: ["service-features", serviceId] })
      queryClient.invalidateQueries({ queryKey: ["service-feature-access", serviceId, featureId] })
    },
  })
}

/**
 * Hook to disable a service feature
 */
export function useDisableFeature() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serviceId, featureId }: { serviceId: string; featureId: string }) =>
      featuresApi.disableFeature(serviceId, featureId),
    onSuccess: (_, { serviceId, featureId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["features"] })
      queryClient.invalidateQueries({ queryKey: ["service-features", serviceId] })
      queryClient.invalidateQueries({ queryKey: ["service-feature-access", serviceId, featureId] })
    },
  })
}

/**
 * Query keys for external use
 */
export const featuresQueryKeys = {
  all: ["features"] as const,
  flags: () => [...featuresQueryKeys.all, "flags"] as const,
  flag: (name: string) => [...featuresQueryKeys.flags(), name] as const,
  serviceFeatures: (serviceId: string) => [...featuresQueryKeys.all, "service", serviceId] as const,
  serviceFeatureAccess: (serviceId: string, featureId: string) =>
    [...featuresQueryKeys.serviceFeatures(serviceId), "access", featureId] as const,
}
