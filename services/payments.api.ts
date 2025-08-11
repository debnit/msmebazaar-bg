import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient, type ApiResponse } from "./api-client"

/**
 * Payment-related interfaces
 */
interface PaymentMethod {
  id: string
  type: "card" | "upi" | "netbanking" | "wallet"
  provider: string
  last4?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
  createdAt: string
}

interface CreatePaymentRequest {
  amount: number
  currency: string
  purpose: "pro_subscription" | "loan_processing" | "service_fee" | "other"
  description?: string
  metadata?: Record<string, any>
  paymentMethodId?: string
  returnUrl?: string
}

interface CreatePaymentResponse {
  paymentId: string
  orderId: string
  amount: number
  currency: string
  status: "created" | "pending" | "processing"
  paymentUrl?: string
  razorpayOrderId?: string
  razorpayKeyId?: string
  expiresAt: string
}

interface PaymentStatus {
  paymentId: string
  orderId: string
  status: "created" | "pending" | "processing" | "completed" | "failed" | "cancelled" | "refunded"
  amount: number
  currency: string
  paymentMethod?: PaymentMethod
  transactionId?: string
  failureReason?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}

interface VerifyPaymentRequest {
  paymentId: string
  razorpayPaymentId?: string
  razorpayOrderId?: string
  razorpaySignature?: string
}

interface VerifyPaymentResponse {
  verified: boolean
  payment: PaymentStatus
  message: string
}

interface RefundRequest {
  paymentId: string
  amount?: number
  reason: string
}

interface RefundResponse {
  refundId: string
  paymentId: string
  amount: number
  status: "pending" | "processed" | "failed"
  reason: string
  processedAt?: string
}

interface PaymentHistory {
  payments: PaymentStatus[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

interface SubscriptionPayment {
  subscriptionId: string
  planType: "pro" | "enterprise"
  amount: number
  currency: string
  billingCycle: "monthly" | "yearly"
  nextBillingDate: string
  status: "active" | "cancelled" | "expired"
}

/**
 * Payments API service class
 * Handles all payment-related API calls including Razorpay integration
 */
class PaymentsApiService {
  /**
   * Create a new payment order
   */
  async createPayment(request: CreatePaymentRequest): Promise<ApiResponse<CreatePaymentResponse>> {
    return apiClient.post<ApiResponse<CreatePaymentResponse>>("/payments/create", request)
  }

  /**
   * Get payment status by ID
   */
  async getPaymentStatus(paymentId: string): Promise<ApiResponse<PaymentStatus>> {
    return apiClient.get<ApiResponse<PaymentStatus>>(`/payments/${paymentId}/status`)
  }

  /**
   * Verify payment after completion
   */
  async verifyPayment(request: VerifyPaymentRequest): Promise<ApiResponse<VerifyPaymentResponse>> {
    return apiClient.post<ApiResponse<VerifyPaymentResponse>>("/payments/verify", request)
  }

  /**
   * Get user's payment history
   */
  async getPaymentHistory(page = 1, limit = 10): Promise<ApiResponse<PaymentHistory>> {
    return apiClient.get<ApiResponse<PaymentHistory>>(`/payments/history?page=${page}&limit=${limit}`)
  }

  /**
   * Get saved payment methods
   */
  async getPaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
    return apiClient.get<ApiResponse<PaymentMethod[]>>("/payments/methods")
  }

  /**
   * Add new payment method
   */
  async addPaymentMethod(methodData: Partial<PaymentMethod>): Promise<ApiResponse<PaymentMethod>> {
    return apiClient.post<ApiResponse<PaymentMethod>>("/payments/methods", methodData)
  }

  /**
   * Delete payment method
   */
  async deletePaymentMethod(methodId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<ApiResponse<{ message: string }>>(`/payments/methods/${methodId}`)
  }

  /**
   * Set default payment method
   */
  async setDefaultPaymentMethod(methodId: string): Promise<ApiResponse<PaymentMethod>> {
    return apiClient.patch<ApiResponse<PaymentMethod>>(`/payments/methods/${methodId}/default`)
  }

  /**
   * Request refund for a payment
   */
  async requestRefund(request: RefundRequest): Promise<ApiResponse<RefundResponse>> {
    return apiClient.post<ApiResponse<RefundResponse>>("/payments/refund", request)
  }

  /**
   * Get refund status
   */
  async getRefundStatus(refundId: string): Promise<ApiResponse<RefundResponse>> {
    return apiClient.get<ApiResponse<RefundResponse>>(`/payments/refunds/${refundId}`)
  }

  /**
   * Create Pro subscription payment
   */
  async createProSubscription(
    planType: "pro" | "enterprise",
    billingCycle: "monthly" | "yearly",
  ): Promise<ApiResponse<CreatePaymentResponse>> {
    return apiClient.post<ApiResponse<CreatePaymentResponse>>("/payments/subscription/pro", {
      planType,
      billingCycle,
    })
  }

  /**
   * Get current subscription details
   */
  async getSubscription(): Promise<ApiResponse<SubscriptionPayment>> {
    return apiClient.get<ApiResponse<SubscriptionPayment>>("/payments/subscription")
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<ApiResponse<{ message: string }>>("/payments/subscription/cancel")
  }

  /**
   * Get payment analytics for admin/business users
   */
  async getPaymentAnalytics(
    startDate?: string,
    endDate?: string,
  ): Promise<
    ApiResponse<{
      totalRevenue: number
      totalTransactions: number
      successRate: number
      averageOrderValue: number
      revenueByMonth: Array<{ month: string; revenue: number }>
      paymentMethodBreakdown: Array<{ method: string; count: number; percentage: number }>
    }>
  > {
    const params = new URLSearchParams()
    if (startDate) params.append("startDate", startDate)
    if (endDate) params.append("endDate", endDate)

    return apiClient.get<ApiResponse<any>>(`/payments/analytics?${params.toString()}`)
  }
}

// Export singleton instance
export const paymentsApiService = new PaymentsApiService()

/**
 * React Query hooks for payments
 */

/**
 * Hook for creating payment mutation
 */
export function useCreatePayment() {
  return useMutation({
    mutationFn: (request: CreatePaymentRequest) => paymentsApiService.createPayment(request),
    onError: (error) => {
      console.error("Create payment failed:", error)
    },
  })
}

/**
 * Hook for verifying payment mutation
 */
export function useVerifyPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: VerifyPaymentRequest) => paymentsApiService.verifyPayment(request),
    onSuccess: (response, variables) => {
      // Invalidate payment status and history queries
      queryClient.invalidateQueries({ queryKey: ["payments", "status", variables.paymentId] })
      queryClient.invalidateQueries({ queryKey: ["payments", "history"] })
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] }) // User might have Pro status updated
    },
    onError: (error) => {
      console.error("Payment verification failed:", error)
    },
  })
}

/**
 * Hook for getting payment status
 */
export function usePaymentStatus(paymentId: string, enabled = true) {
  return useQuery({
    queryKey: ["payments", "status", paymentId],
    queryFn: () => paymentsApiService.getPaymentStatus(paymentId),
    enabled: enabled && !!paymentId,
    refetchInterval: (data) => {
      // Stop polling if payment is completed, failed, or cancelled
      const status = data?.data?.status
      return status && ["completed", "failed", "cancelled", "refunded"].includes(status) ? false : 5000
    },
    staleTime: 0, // Always fetch fresh data for payment status
  })
}

/**
 * Hook for getting payment history
 */
export function usePaymentHistory(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["payments", "history", page, limit],
    queryFn: () => paymentsApiService.getPaymentHistory(page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Hook for getting payment methods
 */
export function usePaymentMethods() {
  return useQuery({
    queryKey: ["payments", "methods"],
    queryFn: () => paymentsApiService.getPaymentMethods(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook for adding payment method
 */
export function useAddPaymentMethod() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (methodData: Partial<PaymentMethod>) => paymentsApiService.addPaymentMethod(methodData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments", "methods"] })
    },
    onError: (error) => {
      console.error("Add payment method failed:", error)
    },
  })
}

/**
 * Hook for deleting payment method
 */
export function useDeletePaymentMethod() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (methodId: string) => paymentsApiService.deletePaymentMethod(methodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments", "methods"] })
    },
    onError: (error) => {
      console.error("Delete payment method failed:", error)
    },
  })
}

/**
 * Hook for creating Pro subscription
 */
export function useCreateProSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ planType, billingCycle }: { planType: "pro" | "enterprise"; billingCycle: "monthly" | "yearly" }) =>
      paymentsApiService.createProSubscription(planType, billingCycle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments", "subscription"] })
    },
    onError: (error) => {
      console.error("Create Pro subscription failed:", error)
    },
  })
}

/**
 * Hook for getting subscription details
 */
export function useSubscription() {
  return useQuery({
    queryKey: ["payments", "subscription"],
    queryFn: () => paymentsApiService.getSubscription(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 404 (no subscription)
      if (error?.status === 404) return false
      return failureCount < 3
    },
  })
}

/**
 * Hook for requesting refund
 */
export function useRequestRefund() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: RefundRequest) => paymentsApiService.requestRefund(request),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payments", "status", variables.paymentId] })
      queryClient.invalidateQueries({ queryKey: ["payments", "history"] })
    },
    onError: (error) => {
      console.error("Refund request failed:", error)
    },
  })
}

/**
 * Hook for getting payment analytics (admin/business users)
 */
export function usePaymentAnalytics(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ["payments", "analytics", startDate, endDate],
    queryFn: () => paymentsApiService.getPaymentAnalytics(startDate, endDate),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
