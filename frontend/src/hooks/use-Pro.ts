"use client";

import { useAuthStore } from "@/store/auth.store";
import { usePaymentStore } from "@/store/ui.store";
import { api } from "@/services/api-client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

/**
 * Hook for managing MSMEBazaar Pro subscription:
 * - Verifies Pro status via API Gateway
 * - Initiates/Verifies Pro upgrades via Gateway Payments API
 * - Exposes Pro-related utilities for feature gating
 */
export const usePro = () => {
  const router = useRouter();
  const { user, isPro, setProStatus, updateUserProfile } = useAuthStore();
  const { isProcessingPayment, setProcessingPayment } = usePaymentStore();

  const [isVerifying, setIsVerifying] = useState(false);

  /** ===== Basic check ===== */
  const hasProAccess = useCallback(
    () => isPro && user?.isPro === true,
    [isPro, user?.isPro]
  );

  /** ===== Verify Pro status via Gateway ===== */
  const verifyProStatus = useCallback(async () => {
    if (!user?.id) return false;
    setIsVerifying(true);
    try {
      const res = await api.user.getProStatus(user.id);
      const isProActive =
        res.success && res.data?.isPro && res.data?.subscriptionActive;
      setProStatus(!!isProActive);
      updateUserProfile({ isPro: !!isProActive });
      return !!isProActive;
    } catch (error) {
      console.error("Failed to verify Pro status:", error);
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [user?.id, setProStatus, updateUserProfile]);

  /** ===== Begin Pro subscription payment ===== */
  const subscribeToPro = useCallback(
    async (planId = "pro_yearly") => {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to subscribe to Pro",
          variant: "destructive",
        });
        return;
      }
      if (isPro) {
        toast({
          title: "Already Pro",
          description: "You already have an active Pro subscription",
        });
        return;
      }
      setProcessingPayment(true);
      try {
        const paymentOrderRes = await api.payments.createProUpgrade(planId);
        if (!paymentOrderRes.success)
          throw new Error(paymentOrderRes.message);

        const paymentData = paymentOrderRes.data;
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: paymentData.amount,
          currency: paymentData.currency,
          name: "MSMEBazaar",
          description: "Pro Subscription",
          order_id: paymentData.orderId,
          handler: async (response: any) => {
            await handlePaymentSuccess(response);
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone,
          },
          theme: { color: "#3B82F6" },
          modal: {
            ondismiss: () => {
              setProcessingPayment(false);
              toast({
                title: "Payment Cancelled",
                description: "Pro subscription payment was cancelled",
                variant: "destructive",
              });
            },
          },
        };
        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      } catch (error: any) {
        setProcessingPayment(false);
        toast({
          title: "Payment Failed",
          description: error?.message || "Failed to initiate payment",
          variant: "destructive",
        });
      }
    },
    [user, isPro, setProcessingPayment]
  );

  /** ===== Handle successful payment ===== */
  const handlePaymentSuccess = useCallback(
    async (paymentResponse: any) => {
      try {
        const verification = await api.payments.verifyProUpgrade({
          razorpayPaymentId: paymentResponse.razorpay_payment_id,
          razorpayOrderId: paymentResponse.razorpay_order_id,
          razorpaySignature: paymentResponse.razorpay_signature,
        });

        if (verification.success) {
          const profileRes = await api.user.getProfile();
          if (profileRes.success && profileRes.data) {
            setProStatus(true);
            updateUserProfile({ isPro: true });
          }
          toast({
            title: "Welcome to MSMEBazaar Pro! 🎉",
            description: "You now have access to all premium features",
          });
          router.push("/dashboard?welcome=pro");
        } else {
          throw new Error("Payment verification failed");
        }
      } catch (error: any) {
        toast({
          title: "Payment Verification Failed",
          description: error?.message || "Please contact support",
          variant: "destructive",
        });
      } finally {
        setProcessingPayment(false);
      }
    },
    [setProStatus, updateUserProfile, router, setProcessingPayment]
  );

  /** ===== Static list of Pro features ===== */
  const getProFeatures = useCallback(
    () => [
      "Advanced Business Loans",
      "AI-Powered Valuation",
      "Exit Strategy Planning",
      "Premium Market Linkage",
      "Priority Support",
      "Advanced Analytics",
      "Custom Reports",
      "API Access",
    ],
    []
  );

  /** ===== Identify if a feature is Pro-only ===== */
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
    ];
    return proOnlyFeatures.includes(featureName);
  }, []);

  /** ===== Get upgrade prompt text for a feature ===== */
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
    };
    return prompts[featureName] || "Upgrade to Pro to access this premium feature";
  }, []);

  /** ===== Show a Pro upgrade modal/prompt ===== */
  const showProUpgradeModal = useCallback(
    (featureName?: string) => {
      const message = featureName
        ? getProUpgradePrompt(featureName)
        : "Upgrade to MSMEBazaar Pro to unlock all premium features";

      toast({
        title: "Pro Feature",
        description: message,
        action: { label: "Upgrade Now", onClick: subscribeToPro },
      });
    },
    [getProUpgradePrompt, subscribeToPro]
  );

  /** ===== Trial period helpers ===== */
  const getTrialDaysRemaining = useCallback(() => {
    if (!user?.trialEndsAt) return 0;
    const trialEnd = new Date(user.trialEndsAt);
    const now = new Date();
    const diffTime = trialEnd.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }, [user?.trialEndsAt]);

  const isInTrial = useCallback(
    () => getTrialDaysRemaining() > 0,
    [getTrialDaysRemaining]
  );

  /** ===== On-mount logic ===== */
  useEffect(() => {
    // Load Razorpay checkout once
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  useEffect(() => {
    if (user?.id) {
      verifyProStatus();
      const interval = setInterval(verifyProStatus, 30 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [user?.id, verifyProStatus]);

  return {
    // State/flags
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

    // Utils
    isProFeature,
    getProUpgradePrompt,
  };
};

export default usePro;
