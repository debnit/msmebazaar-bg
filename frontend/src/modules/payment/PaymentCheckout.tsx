import React, { useCallback, useEffect, useState } from "react";
import { api } from "@/services/api-client";

export interface PaymentCheckoutProps {
  amount: number;
  currency?: string;
  description?: string;
  onSuccess?: () => void; // Callback for payment success
}

async function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const PaymentCheckoutInner: React.FC<PaymentCheckoutProps> = ({
  amount,
  currency = "INR",
  description,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  useEffect(() => {
    loadRazorpay();
  }, []);

  const openRazorpay = useCallback((orderId: string) => {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
    if (!keyId) {
      setError("Missing Razorpay key. Set NEXT_PUBLIC_RAZORPAY_KEY_ID in env.");
      return;
    }

    const options: any = {
      key: keyId,
      order_id: orderId,
      handler: async (response: any) => {
        try {
          // Verify payment with backend
          await api.payments.verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          try {
            const profileRes = await api.user.getProfile();
            if (profileRes.success && profileRes.data) {
              const { useAuthStore } = await import("@/store/auth.store");
              useAuthStore.getState().setUser({ ...profileRes.data, isPro: true } as any);
              useAuthStore.getState().setProStatus(true);
            }
          } catch {}
          if (onSuccess) onSuccess();
        } catch (err) {
          console.error("Payment verification failed", err);
          setError("Payment verification failed. Please contact support.");
        }
      },
      modal: {
        ondismiss: () => {
          setError("Payment cancelled by user.");
        },
      },
      theme: { color: "#2563eb" },
    };

    const Razorpay = (window as any).Razorpay;
    if (!Razorpay) {
      setError("Razorpay SDK not loaded.");
      return;
    }
    const rzp = new Razorpay(options);
    rzp.open();
  }, [onSuccess]);

  const onPayNow = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const resp = await api.payments.createOrder({ amount, currency, description });
      const orderId = (resp?.data as any)?.razorpayOrder?.id;
      if (!orderId) throw new Error("Failed to obtain order id");
      setLastOrderId(orderId);
      openRazorpay(orderId);
    } catch (e: any) {
      console.error("Error initiating payment:", e);
      setError(e?.message || "Error initiating payment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Pay ₹{amount}</h3>
        <p className="text-sm text-gray-500">Secured by Razorpay</p>
      </div>
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>
      )}
      {error && lastOrderId && (
        <button
          className="w-full h-10 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
          onClick={() => openRazorpay(lastOrderId)}
        >
          Retry Payment
        </button>
      )}
      <button
        className="w-full h-11 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        disabled={isLoading}
        onClick={onPayNow}
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default PaymentCheckoutInner;
