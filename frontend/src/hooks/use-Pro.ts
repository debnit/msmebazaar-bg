"use client"

import { useAuthStore } from "@/store/auth.store"
import { usePaymentStore } from "@/store/ui.store"
import { useCreatePayment, useVerifyPayment } from "@/services/payments.api"
import { useCallback, useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

/**
 * Custom hook for managing Pro subscription status and payments
 * Handles Pro verification, payment processing, and feature access
 */
export const usePro = () => {
  const router = useRouter()
  const { user, isPro, setProStatus, updateUserProfile } = useAuthStore()
  const { isProcessingPayment, setProcessingPayment } = usePaymentStore()

  const [isVerifying, setIsVerifying] = useState(false)
  const [proFeatures, setProFeatures] = useState<string[]>([])

  const createPaymentMutation = useCreatePayment()
  const verifyPaymentMutation = useVerifyPayment()

  /**
   * Check if user has Pro access
   */
  const hasProAccess = useCallback(() => {
    return isPro && user?.isPro === true
  }, [isPro, user?.isPro])

  /**
   * Verify Pro status with server
   */
  const verifyProStatus = useCallback(async () => {
    if (!user?.id) return false

    setIsVerifying(true)
    try {
      // This would typically call an API to verify Pro status
      const response = await fetch(`/api/users/${user.id}/pro-status`, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const isProActive = data.isPro && data.subscriptionActive

        if (isProActive !== isPro) {
          setProStatus(isProActive)
          updateUserProfile({ isPro: isProActive })
        }

        return isProActive
      }
      return false
    } catch (error) {
      console.error("Failed to verify Pro status:", error)
      return false
    } finally {
      setIsVerifying(false)
    }
  }, [user?.id, isPro, setProStatus, updateUserProfile])

  /**
   * Initiate Pro subscription payment
   */
  const subscribeToPro = useCallback(async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to subscribe to Pro",
        variant: "destructive",
      })
      return
    }

    if (isPro) {
      toast({
        title: "Already Pro",
        description: "You already have an active Pro subscription",
      })
      return
    }

    setProcessingPayment(true)
    try {
      const paymentData = await createPaymentMutation.mutateAsync({
        amount: 9900, // ₹99 in paise
        currency: "INR",
        description: "MSMEBazaar Pro Subscription",
        userId: user.id,
        planType: "pro_monthly",
      })

      // Open Razorpay payment modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: "MSMEBazaar",
        description: "Pro Subscription",
        order_id: paymentData.orderId,
        handler: async (response: any) => {
          await handlePaymentSuccess(response)
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: "#3B82F6",
        },
        modal: {
          ondismiss: () => {
            setProcessingPayment(false)
            toast({
              title: "Payment Cancelled",
              description: "Pro subscription payment was cancelled",
              variant: "destructive",
            })
          },
        },
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()
    } catch (error: any) {
      setProcessingPayment(false)
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to initiate payment",
        variant: "destructive",
      })
    }
  }, [user, isPro, createPaymentMutation, setProcessingPayment])

  /**
   * Handle successful payment
   */
  const handlePaymentSuccess = useCallback(
    async (paymentResponse: any) => {
      try {
        const verification = await verifyPaymentMutation.mutateAsync({
          razorpayPaymentId: paymentResponse.razorpay_payment_id,
          razorpayOrderId: paymentResponse.razorpay_order_id,
          razorpaySignature: paymentResponse.razorpay_signature,
        })

        if (verification.success) {
          setProStatus(true)
          updateUserProfile({ isPro: true })

          toast({
            title: "Welcome to MSMEBazaar Pro! 🎉",
            description: "You now have access to all premium features",
          })

          // Redirect to dashboard or Pro welcome page
          router.push("/dashboard?welcome=pro")
        } else {
          throw new Error("Payment verification failed")
        }
      } catch (error: any) {
        toast({
          title: "Payment Verification Failed",
          description: error.message || "Please contact support",
          variant: "destructive",
        })
      } finally {
        setProcessingPayment(false)
      }
    },
    [verifyPaymentMutation, setProStatus, updateUserProfile, router, setProcessingPayment],
  )

  /**
   * Get Pro features list
   */
  const getProFeatures = useCallback(() => {
    return [
      "Advanced Business Loans",
      "AI-Powered Valuation",
      "Exit Strategy Planning",
      "Premium Market Linkage",
      "Priority Support",
      "Advanced Analytics",
      "Custom Reports",
      "API Access",
    ]
  }, [])

  /**
   * Check if specific feature requires Pro
   */
  const isProFeature = useCallback((featureName: string) => {
    const proOnlyFeatures = [
      "advanced-loans",
      "ai-valuation",
      "exit-strategy",
      "premium-market-linkage",
      "priority-support",
      "analytics",
      "custom-reports",
      "api-access",
    ]
    return proOnlyFeatures.includes(featureName)
  }, [])

  /**
   * Get Pro upgrade prompt for feature
   */
  const getProUpgradePrompt = useCallback((featureName: string) => {
    const prompts: Record<string, string> = {
      "advanced-loans": "Unlock advanced loan options with better rates and higher amounts",
      "ai-valuation": "Get AI-powered business valuation with detailed insights",
      "exit-strategy": "Access comprehensive exit strategy planning tools",
      "premium-market-linkage": "Connect with premium buyers and suppliers",
      "priority-support": "Get priority customer support and dedicated assistance",
      analytics: "Access detailed business analytics and insights",
      "custom-reports": "Generate custom reports and export data",
      "api-access": "Integrate with our API for advanced functionality",
    }
    return prompts[featureName] || "Upgrade to Pro to access this premium feature"
  }, [])

  /**
   * Show Pro upgrade modal
   */
  const showProUpgradeModal = useCallback(
    (featureName?: string) => {
      const message = featureName
        ? getProUpgradePrompt(featureName)
        : "Upgrade to MSMEBazaar Pro to unlock all premium features"

      toast({
        title: "Pro Feature",
        description: message,
        action: {
          label: "Upgrade Now",
          onClick: subscribeToPro,
        },
      })
    },
    [getProUpgradePrompt, subscribeToPro],
  )

  /**
   * Calculate days remaining in trial (if applicable)
   */
  const getTrialDaysRemaining = useCallback(() => {
    if (!user?.trialEndsAt) return 0

    const trialEnd = new Date(user.trialEndsAt)
    const now = new Date()
    const diffTime = trialEnd.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return Math.max(0, diffDays)
  }, [user?.trialEndsAt])

  /**
   * Check if user is in trial period
   */
  const isInTrial = useCallback(() => {
    return getTrialDaysRemaining() > 0
  }, [getTrialDaysRemaining])

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  // Verify Pro status on mount and periodically
  useEffect(() => {
    if (user?.id) {
      verifyProStatus()

      // Verify Pro status every 30 minutes
      const interval = setInterval(verifyProStatus, 30 * 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [user?.id, verifyProStatus])

  return {
    // State
    isPro,
    hasProAccess: hasProAccess(),
    isVerifying,
    isProcessingPayment,
    proFeatures: getProFeatures(),
    trialDaysRemaining: getTrialDaysRemaining(),
    isInTrial: isInTrial(),

    // Actions
    subscribeToPro,
    verifyProStatus,
    showProUpgradeModal,

    // Utilities
    isProFeature,
    getProUpgradePrompt,

    // Loading states
    isCreatingPayment: createPaymentMutation.isPending,
    isVerifyingPayment: verifyPaymentMutation.isPending,
  }
}

export default usePro
