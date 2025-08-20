import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, type ApiResponse } from "./api-client";

/**
 * Payment-related interfaces
 */
export interface PaymentMethod {
  id: string;
  type: "card" | "upi" | "netbanking" | "wallet";
  provider: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  createdAt: string;
}

export interface CreatePaymentRequest {
  amount: number;
  currency: string;
  purpose: "pro_subscription" | "loan_processing" | "service_fee" | "other";
  description?: string;
  metadata?: Record<string, any>;
  paymentMethodId?: string;
  returnUrl?: string;
}

export interface CreatePaymentResponse {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: "created" | "pending" | "processing";
  paymentUrl?: string;
  razorpayOrderId?: string;
  razorpayKeyId?: string;
  expiresAt: string;
}

export interface PaymentStatus {
  paymentId: string;
  orderId: string;
  status:
    | "created"
    | "pending"
    | "processing"
    | "completed"
    | "failed"
    | "cancelled"
    | "refunded";
  amount: number;
  currency: string;
  paymentMethod?: PaymentMethod;
  transactionId?: string;
  failureReason?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerifyPaymentRequest {
  paymentId: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
}

export interface VerifyPaymentResponse {
  verified: boolean;
  payment: PaymentStatus;
  message: string;
}

export interface RefundRequest {
  paymentId: string;
  amount?: number;
  reason: string;
}

export interface RefundResponse {
  refundId: string;
  paymentId: string;
  amount: number;
  status: "pending" | "processed" | "failed";
  reason: string;
  processedAt?: string;
}

export interface PaymentHistory {
  payments: PaymentStatus[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface SubscriptionPayment {
  subscriptionId: string;
  planType: "pro" | "enterprise";
  amount: number;
  currency: string;
  billingCycle: "monthly" | "yearly";
  nextBillingDate: string;
  status: "active" | "cancelled" | "expired";
}

/**
 * Payments API service class
 * Handles all payment-related API calls including Razorpay integration
 */
export class PaymentsApiService {
  async createPayment(
    request: CreatePaymentRequest
  ): Promise<ApiResponse<CreatePaymentResponse>> {
    return apiClient.post<ApiResponse<CreatePaymentResponse>>(
      "/payments/create",
      request
    );
  }

  async getPaymentStatus(
    paymentId: string
  ): Promise<ApiResponse<PaymentStatus>> {
    return apiClient.get<ApiResponse<PaymentStatus>>(
      `/payments/${paymentId}/status`
    );
  }

  async verifyPayment(
    request: VerifyPaymentRequest
  ): Promise<ApiResponse<VerifyPaymentResponse>> {
    return apiClient.post<ApiResponse<VerifyPaymentResponse>>(
      "/payments/verify",
      request
    );
  }

  async getPaymentHistory(
    page = 1,
    limit = 10
  ): Promise<ApiResponse<PaymentHistory>> {
    return apiClient.get<ApiResponse<PaymentHistory>>(
      `/payments/history?page=${page}&limit=${limit}`
    );
  }

  async getPaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
    return apiClient.get<ApiResponse<PaymentMethod[]>>("/payments/methods");
  }

  async addPaymentMethod(
    methodData: Partial<PaymentMethod>
  ): Promise<ApiResponse<PaymentMethod>> {
    return apiClient.post<ApiResponse<PaymentMethod>>(
      "/payments/methods",
      methodData
    );
  }

  async deletePaymentMethod(
    methodId: string
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<ApiResponse<{ message: string }>>(
      `/payments/methods/${methodId}`
    );
  }

  async setDefaultPaymentMethod(
    methodId: string
  ): Promise<ApiResponse<PaymentMethod>> {
    return apiClient.patch<ApiResponse<PaymentMethod>>(
      `/payments/methods/${methodId}/default`
    );
  }

  async requestRefund(
    request: RefundRequest
  ): Promise<ApiResponse<RefundResponse>> {
    return apiClient.post<ApiResponse<RefundResponse>>("/payments/refund", request);
  }

  async getRefundStatus(
    refundId: string
  ): Promise<ApiResponse<RefundResponse>> {
    return apiClient.get<ApiResponse<RefundResponse>>(
      `/payments/refunds/${refundId}`
    );
  }

  async createProSubscription(
    planType: "pro" | "enterprise",
    billingCycle: "monthly" | "yearly"
  ): Promise<ApiResponse<CreatePaymentResponse>> {
    return apiClient.post<ApiResponse<CreatePaymentResponse>>(
      "/payments/subscription/pro",
      {
        planType,
        billingCycle,
      }
    );
  }

  async getSubscription(): Promise<ApiResponse<SubscriptionPayment>> {
    return apiClient.get<ApiResponse<SubscriptionPayment>>(
      "/payments/subscription"
    );
  }

  async cancelSubscription(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<ApiResponse<{ message: string }>>(
      "/payments/subscription/cancel"
    );
  }

  async getPaymentAnalytics(
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    return apiClient.get<ApiResponse<any>>(
      `/payments/analytics?${params.toString()}`
    );
  }
}

// Export singleton instance
export const paymentsApiService = new PaymentsApiService();
