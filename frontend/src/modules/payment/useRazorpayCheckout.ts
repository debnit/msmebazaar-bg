import { useState } from "react";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

interface RazorpayCheckoutOptions {
  keyId: string;
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
}

export function useRazorpayCheckout({ keyId, onSuccess, onError }: RazorpayCheckoutOptions) {
  const [loading, setLoading] = useState(false);

  function openCheckout(orderId: string) {
    if (!window.Razorpay) {
      onError(new Error("Razorpay SDK not loaded"));
      return;
    }

    const options = {
      key: keyId,
      order_id: orderId,
      handler: (response: any) => {
        onSuccess(response);
      },
      modal: {
        ondismiss: () => {
          onError(new Error("Payment cancelled"));
        },
      },
      theme: {
        color: "#3399cc",
      },
    };

    setLoading(true);
    const rzp = new window.Razorpay(options);
    rzp.open();
    setLoading(false);
  }

  return { openCheckout, loading };
}
