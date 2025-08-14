// /shared/types/payments.ts
export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
}

export interface PaymentVerificationRequest {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

export interface Payment extends PaymentOrder {
  id: string;
  userId: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
}
