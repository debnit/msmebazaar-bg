// Payment related types
export interface Payment {
  id: string;
  userId: string;
  orderId: string;
  amount: number;
  currency: 'INR' | 'USD' | 'EUR';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
  method: 'CARD' | 'UPI' | 'NETBANKING' | 'WALLET';
  gatewayPaymentId?: string;
  gatewayOrderId?: string;
  failureReason?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentGatewayResponse {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  signature?: string;
  error?: string;
}

export interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  reason?: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  gatewayRefundId?: string;
  processedAt?: Date;
  createdAt: Date;
}
