"use client"

import { useCallback, useMemo } from "react"
import { useAuthStore } from "@/store/auth.store"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/services/api-client"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

/**
 * Pro status verification response
 */
interface ProStatusResponse {
  isPro: boolean
  proExpiryDate?: string
  proFeatures: string[]
  subscriptionStatus: "active" | "expired" | "cancelled" | "trial"
  trialDaysLeft?: number
}

/**
 * Pro upgrade response
 */
interface ProUpgradeResponse {
  success: boolean
  message: string
  paymentUrl?: string
  subscriptionId?: string
}

/**
 * Custom hook for Pro status management and verification
 * Handles Pro status checks, upgrades, and feature access
 */
export const usePro = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user, isPro, setProStatus, updateUserProfile } = useAuthStore()

  /**
   * Query to verify Pro status from server
   */
  const {
    data: proStatus,
    isLoading: isVerifyingPro,
    error: proVerificationError,
    refetch: refetchProStatus,
  } = useQuery({
    queryKey: ["pro-status", user?.id],
    queryFn: async (): Promise<ProStatusResponse> => {
      const response = await apiClient.get<ProStatusResponse>("/user/pro-status")
      return response.data
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })

  /**
   * Mutation to upgrade user to Pro
   */
  const upgradeToProMutation = useMutation({
    mutationFn: async (paymentData: { amount: number; currency: string }) => {
      const response = await apiClient.post<ProUpgradeResponse>("/payments/upgrade-pro", paymentData)
      return response.data
    },
    onSuccess: (data) => {
      if (data.success) {
        setProStatus(true)
        updateUserProfile({ isPro: true })
        queryClient.invalidateQueries({ queryKey: ["pro-status"] })

        toast({
          title: "Welcome to MSMEBazaar Pro! 🎉",
          description: "You now have access to all premium features",
        })

        // Redirect to dashboard or payment success page
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl
        } else {
          router.push("/dashboard")
        }
      }
    },
    onError: (error: any) => {
      toast({
        title: "Upgrade Failed",
        description: error.message || "Failed to upgrade to Pro. Please try again.",
        variant: "destructive",
      })
    },
  })

  /**
   * Mutation to cancel Pro subscription
   */
  const cancelProMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<{ success: boolean; message: string }>("/payments/cancel-pro")
      return response.data
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["pro-status"] })

        toast({
          title: "Subscription Cancelled",
          description: "Your Pro subscription has been cancelled",
        })
      }
    },
    onError: (error: any) => {
      toast({
        title: "Cancellation Failed",
        description: error.message || "Failed to cancel subscription. Please contact support.",
        variant: "destructive",
      })
    },
  })

  /**
   * Check if user has Pro access
   */
  const hasProAccess = useMemo(() => {
    // Check local state first, then server verification
    if (isPro) return true
    if (proStatus?.isPro) return true
    return false
  }, [isPro, proStatus?.isPro])

  /**
   * Check if user is on trial
   */
  const isOnTrial = useMemo(() => {
    return proStatus?.subscriptionStatus === "trial"
  }, [proStatus?.subscriptionStatus])

  /**
   * Get trial days remaining
   */
  const trialDaysLeft = useMemo(() => {
    return proStatus?.trialDaysLeft || 0
  }, [proStatus?.trialDaysLeft])

  /**
   * Check if Pro subscription is expired
   */
  const isProExpired = useMemo(() => {
    return proStatus?.subscriptionStatus === "expired"
  }, [proStatus?.subscriptionStatus])

  /**
   * Get Pro features list
   */
  const proFeatures = useMemo(() => {
    return (
      proStatus?.proFeatures || [
        "Advanced Business Loans",
        "AI-Powered Valuation",
        "Exit Strategy Planning",
        "Premium Market Linkage",
        "Priority Support",
        "Advanced Analytics",
        "Custom Reports",
        "API Access",
      ]
    )
  }, [proStatus?.proFeatures])

  /**
   * Check if user has access to a specific Pro feature
   */
  const hasFeatureAccess = useCallback(
    (feature: string): boolean => {
      if (!hasProAccess) return false
      return proFeatures.includes(feature)
    },
    [hasProAccess, proFeatures],
  )

  /**
   * Upgrade to Pro with ₹99 payment
   */
  const upgradeToPro = useCallback(async () => {
    try {
      await upgradeToProMutation.mutateAsync({
        amount: 99,
        currency: "INR",
      })
    } catch (error) {
      console.error("Pro upgrade failed:", error)
    }
  }, [upgradeToProMutation])

  /**
   * Cancel Pro subscription
   */
  const cancelPro = useCallback(async () => {
    try {
      await cancelProMutation.mutateAsync()
    } catch (error) {
      console.error("Pro cancellation failed:", error)
    }
  }, [cancelProMutation])

  /**
   * Redirect to Pro upgrade page
   */
  const redirectToUpgrade = useCallback(() => {
    router.push("/onboarding-welcome")
  }, [router])

  /**
   * Show Pro upgrade modal/toast
   */
  const showUpgradePrompt = useCallback(
    (feature?: string) => {
      const message = feature ? `Upgrade to Pro to access ${feature}` : "Upgrade to Pro to unlock all premium features"

      toast({
        title: "Pro Feature Required",
        description: message,
        action: {
          label: "Upgrade for ₹99",
          onClick: redirectToUpgrade,
        },
      })
    },
    [redirectToUpgrade],
  )

  /**
   * Get Pro status display information
   */
  const getProStatusInfo = useMemo(() => {
    if (!proStatus) {
      return {
        status: "loading",
        message: "Checking Pro status...",
        color: "gray",
      }
    }

    if (proStatus.subscriptionStatus === "active") {
      return {
        status: "active",
        message: "Pro Active",
        color: "green",
        expiryDate: proStatus.proExpiryDate,
      }
    }

    if (proStatus.subscriptionStatus === "trial") {
      return {
        status: "trial",
        message: `Trial - ${trialDaysLeft} days left`,
        color: "blue",
      }
    }

    if (proStatus.subscriptionStatus === "expired") {
      return {
        status: "expired",
        message: "Pro Expired",
        color: "red",
      }
    }

    return {
      status: "inactive",
      message: "Not Pro",
      color: "gray",
    }
  }, [proStatus, trialDaysLeft])

  /**
   * Sync local Pro status with server
   */
  const syncProStatus = useCallback(async () => {
    try {
      const serverStatus = await refetchProStatus()
      if (serverStatus.data?.isPro !== isPro) {
        setProStatus(serverStatus.data?.isPro || false)
        updateUserProfile({ isPro: serverStatus.data?.isPro || false })
      }
    } catch (error) {
      console.error("Failed to sync Pro status:", error)
    }
  }, [refetchProStatus, isPro, setProStatus, updateUserProfile])

  return {
    // Status
    hasProAccess,
    isOnTrial,
    isProExpired,
    trialDaysLeft,
    proFeatures,
    proStatus: getProStatusInfo,

    // Actions
    upgradeToPro,
    cancelPro,
    redirectToUpgrade,
    showUpgradePrompt,
    hasFeatureAccess,
    syncProStatus,

    // Loading states
    isVerifyingPro,
    isUpgrading: upgradeToProMutation.isPending,
    isCancelling: cancelProMutation.isPending,

    // Errors
    proVerificationError,
  }
}

export default usePro
