import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, type ApiResponse } from "./api-client";
import { Alert } from 'react-native';

/**
 * Shared payment interfaces - reusing from frontend
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
  purpose: "pro_subscription" | "loan_processing" | "service_fee" | "other" | "onboarding";
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

/**
 * Mobile Payment API Service - reuses frontend logic with mobile adaptations
 */
export class MobilePaymentService {
  async createPayment(
    request: CreatePaymentRequest
  ): Promise<ApiResponse<CreatePaymentResponse>> {
    try {
      return await apiClient.post<ApiResponse<CreatePaymentResponse>>(
        "/payments/orders",
        request
      );
    } catch (error: any) {
      Alert.alert('Payment Error', error.message || 'Failed to create payment');
      throw error;
    }
  }

  async getPaymentStatus(
    paymentId: string
  ): Promise<ApiResponse<PaymentStatus>> {
    try {
      return await apiClient.get<ApiResponse<PaymentStatus>>(
        `/payments/${paymentId}`
      );
    } catch (error: any) {
      console.error('Failed to get payment status:', error);
      throw error;
    }
  }

  async verifyPayment(
    request: VerifyPaymentRequest
  ): Promise<ApiResponse<VerifyPaymentResponse>> {
    try {
      return await apiClient.post<ApiResponse<VerifyPaymentResponse>>(
        "/payments/verify",
        request
      );
    } catch (error: any) {
      Alert.alert('Payment Verification Failed', error.message || 'Failed to verify payment');
      throw error;
    }
  }

  async getPaymentHistory(
    page = 1,
    limit = 10
  ): Promise<ApiResponse<any>> {
    try {
      return await apiClient.get<ApiResponse<any>>(
        `/payments/history?page=${page}&limit=${limit}`
      );
    } catch (error: any) {
      console.error('Failed to get payment history:', error);
      throw error;
    }
  }

  async getPaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
    try {
      return await apiClient.get<ApiResponse<PaymentMethod[]>>("/payments/methods");
    } catch (error: any) {
      console.error('Failed to get payment methods:', error);
      throw error;
    }
  }

  async createProSubscription(
    planType: "pro" | "enterprise",
    billingCycle: "monthly" | "yearly"
  ): Promise<ApiResponse<CreatePaymentResponse>> {
    try {
      return await apiClient.post<ApiResponse<CreatePaymentResponse>>(
        "/payments/subscription/pro",
        {
          planType,
          billingCycle,
        }
      );
    } catch (error: any) {
      Alert.alert('Subscription Error', error.message || 'Failed to create subscription');
      throw error;
    }
  }
}

// Export singleton instance
export const mobilePaymentService = new MobilePaymentService();

/**
 * React Query hooks for mobile payment operations
 */
export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: CreatePaymentRequest) => 
      mobilePaymentService.createPayment(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
    onError: (error: any) => {
      console.error('Payment creation failed:', error);
    },
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: VerifyPaymentRequest) => 
      mobilePaymentService.verifyPayment(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      Alert.alert('Success', 'Payment verified successfully!');
    },
    onError: (error: any) => {
      console.error('Payment verification failed:', error);
    },
  });
};

export const usePaymentHistory = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['payments', 'history', page, limit],
    queryFn: () => mobilePaymentService.getPaymentHistory(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePaymentMethods = () => {
  return useQuery({
    queryKey: ['payments', 'methods'],
    queryFn: () => mobilePaymentService.getPaymentMethods(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateProSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ planType, billingCycle }: { 
      planType: "pro" | "enterprise"; 
      billingCycle: "monthly" | "yearly" 
    }) => mobilePaymentService.createProSubscription(planType, billingCycle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      Alert.alert('Success', 'Subscription created successfully!');
    },
    onError: (error: any) => {
      console.error('Subscription creation failed:', error);
    },
  });
};
