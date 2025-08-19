import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, type ApiResponse } from "./api-client";

/**
 * Payment-related interfaces
 */
interface PaymentMethod {
  id: string;
  type: "card" | "upi" | "netbanking" | "wallet";
  provider: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  createdAt: string;
}

interface CreatePaymentRequest {
  amount: number;
  currency: string;
  purpose: "pro_subscription" | "loan_processing" | "service_fee" | "other";
  description?: string;
  metadata?: Record<string, any>;
  paymentMethodId?: string;
  returnUrl?: string;
}

interface CreatePaymentResponse {
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

interface PaymentStatus {
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

interface VerifyPaymentRequest {
  paymentId: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
}

interface VerifyPaymentResponse {
  verified: boolean;
  payment: PaymentStatus;
  message: string;
}

interface RefundRequest {
  paymentId: string;
  amount?: number;
  reason: string;
}

interface RefundResponse {
  refundId: string;
  paymentId: string;
  amount: number;
  status: "pending" | "processed" | "failed";
  reason: string;
  processedAt?: string;
}

interface PaymentHistory {
  payments: PaymentStatus[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

interface SubscriptionPayment {
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
class PaymentsApiService {
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

export const paymentsApiService = new PaymentsApiService();

// React Query hooks

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreatePaymentRequest) =>
      paymentsApiService.createPayment(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments", "history"] });
    },
    onError: (error) => {
      console.error("Create payment failed:", error);
    },
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: VerifyPaymentRequest) =>
      paymentsApiService.verifyPayment(request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payments", "status", variables.paymentId] });
      queryClient.invalidateQueries({ queryKey: ["payments", "history"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    },
    onError: (error) => {
      console.error("Payment verification failed:", error);
    },
  });
}

export function usePaymentStatus(paymentId: string, enabled = true) {
  return useQuery({
    queryKey: ["payments", "status", paymentId],
    queryFn: () => paymentsApiService.getPaymentStatus(paymentId),
    enabled: enabled && !!paymentId,
    refetchInterval: (data) => {
      const status = data?.data?.status;
      return status && ["completed", "failed", "cancelled", "refunded"].includes(status)
        ? false
        : 5000;
    },
    staleTime: 0,
  });
}

export function usePaymentHistory(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["payments", "history", page, limit],
    queryFn: () => paymentsApiService.getPaymentHistory(page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: ["payments", "methods"],
    queryFn: () => paymentsApiService.getPaymentMethods(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAddPaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (methodData: Partial<PaymentMethod>) =>
      paymentsApiService.addPaymentMethod(methodData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments", "methods"] });
    },
    onError: (error) => {
      console.error("Add payment method failed:", error);
    },
  });
}

export function useDeletePaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (methodId: string) =>
      paymentsApiService.deletePaymentMethod(methodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments", "methods"] });
    },
    onError: (error) => {
      console.error("Delete payment method failed:", error);
    },
  });
}

export function useCreateProSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      planType: "pro" | "enterprise";
      billingCycle: "monthly" | "yearly";
    }) => paymentsApiService.createProSubscription(params.planType, params.billingCycle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments", "subscription"] });
    },
    onError: (error) => {
      console.error("Create Pro subscription failed:", error);
    },
  });
}

export function useSubscription() {
  return useQuery({
    queryKey: ["payments", "subscription"],
    queryFn: () => paymentsApiService.getSubscription(),
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.status === 404) return false;
      return failureCount < 3;
    },
  });
}

export function useRequestRefund() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: RefundRequest) =>
      paymentsApiService.requestRefund(request),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payments", "status", variables.paymentId] });
      queryClient.invalidateQueries({ queryKey: ["payments", "history"] });
    },
    onError: (error) => {
      console.error("Refund request failed:", error);
    },
  });
}

export function usePaymentAnalytics(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ["payments", "analytics", startDate, endDate],
    queryFn: () => paymentsApiService.getPaymentAnalytics(startDate, endDate),
    staleTime: 10 * 60 * 1000,
  });
}
