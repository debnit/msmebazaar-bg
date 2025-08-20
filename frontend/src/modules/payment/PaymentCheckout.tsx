import React, { useState } from "react";
import { useCreatePayment } from "./useCreatePayment";
import { useRazorpayCheckout } from "./useRazorpayCheckout";
import PaymentProGuard from "./PaymentProGuard";

export interface PaymentCheckoutProps {
  amount: number;
  currency?: string;
  onSuccess?: () => void; // Callback for payment success
}

const PaymentCheckoutInner: React.FC<PaymentCheckoutProps> = ({
  amount,
  currency = "INR",
  onSuccess,
}) => {
  const { mutateAsync, isLoading } = useCreatePayment();
  const [orderId, setOrderId] = useState<string | null>(null);

  const { openCheckout } = useRazorpayCheckout({
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
    onSuccess: () => {
      alert("Payment successful!");
      if (onSuccess) {
        onSuccess(); // Notify parent
      }
    },
    onError: (error) => {
      alert("Payment failed or was cancelled.");
      console.error(error);
    },
  });

  const onPayNow = async () => {
    try {
      const response = await mutateAsync({
        amount, currency,
        purpose: "pro_subscription"
      });
      const receivedOrderId = response.data?.orderId || response.data?.orderId || null;
      setOrderId(receivedOrderId);
      if (receivedOrderId) {
        openCheckout(receivedOrderId);
      }
    } catch (error) {
      alert("Error initiating payment.");
    }
  };

  return (
    <div>
      <h3>Pay ₹{amount}</h3>
      <button disabled={isLoading} onClick={onPayNow}>
        {isLoading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

const PaymentCheckout: React.FC<PaymentCheckoutProps> = (props) => (
  <PaymentProGuard>
    <PaymentCheckoutInner {...props} />
  </PaymentProGuard>
);

export default PaymentCheckout;
