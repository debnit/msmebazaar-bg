"use client";

import { useCallback } from 'react';
import { api } from '@/services/api-client';
import { useAuthStore } from '@/store/auth.store';
import { toast } from '@/hooks/use-toast';

interface ApiClientOptions {
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
  onError?: (error: any) => void;
  onSuccess?: (data: any) => void;
}

export function useApiClient() {
  const { clearAuth } = useAuthStore();

  const handleApiCall = useCallback(async <T>(
    apiCall: () => Promise<any>,
    options: ApiClientOptions = {}
  ): Promise<{ success: boolean; data?: T; error?: string }> => {
    const {
      showErrorToast = true,
      showSuccessToast = false,
      successMessage = 'Operation completed successfully',
      onError,
      onSuccess
    } = options;

    try {
      const response = await apiCall();
      
      if (response.success) {
        if (showSuccessToast) {
          toast({
            title: "Success",
            description: successMessage,
          });
        }
        
        if (onSuccess) {
          onSuccess(response.data);
        }
        
        return { success: true, data: response.data };
      } else {
        const errorMessage = response.message || 'Operation failed';
        
        if (showErrorToast) {
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
        }
        
        if (onError) {
          onError(response);
        }
        
        return { success: false, error: errorMessage };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      
      // Handle authentication errors
      if (error.status === 401) {
        clearAuth();
        toast({
          title: "Session Expired",
          description: "Please sign in again",
          variant: "destructive",
        });
      } else if (showErrorToast) {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      if (onError) {
        onError(error);
      }
      
      return { success: false, error: errorMessage };
    }
  }, [clearAuth]);

  // Auth API calls
  const auth = {
    login: (credentials: { email: string; password: string }, options?: ApiClientOptions) =>
      handleApiCall(() => api.auth.login(credentials), options),
    
    register: (data: any, options?: ApiClientOptions) =>
      handleApiCall(() => api.auth.register(data), options),
    
    logout: (options?: ApiClientOptions) =>
      handleApiCall(() => api.auth.logout(), options),
    
    refreshToken: (data: { refreshToken: string }, options?: ApiClientOptions) =>
      handleApiCall(() => api.auth.refreshToken(data), options),
  };

  // User API calls
  const user = {
    getProfile: (options?: ApiClientOptions) =>
      handleApiCall(() => api.user.getProfile(), options),
    
    updateProfile: (data: any, options?: ApiClientOptions) =>
      handleApiCall(() => api.user.updateProfile(data), options),
  };

  // Loan API calls
  const loans = {
    apply: (data: any, options?: ApiClientOptions) =>
      handleApiCall(() => api.loans.apply(data), options),
    
    getApplications: (params?: any, options?: ApiClientOptions) =>
      handleApiCall(() => api.loans.getApplications(params), options),
    
    getApplication: (id: string, options?: ApiClientOptions) =>
      handleApiCall(() => api.loans.getApplication(id), options),
    
    fetchLoanStatus: (loanId: string, options?: ApiClientOptions) =>
      handleApiCall(() => api.loans.fetchLoanStatus(loanId), options),
  };

  // Payment API calls
  const payments = {
    createOrder: (data: any, options?: ApiClientOptions) =>
      handleApiCall(() => api.payments.createOrder(data), options),
    
    verifyPayment: (data: any, options?: ApiClientOptions) =>
      handleApiCall(() => api.payments.verifyPayment(data), options),
  };

  // Buyer API calls
  const buyer = {
    getProfile: (options?: ApiClientOptions) =>
      handleApiCall(() => api.buyer.getProfile(), options),
    
    browseListings: (filters?: any, options?: ApiClientOptions) =>
      handleApiCall(() => api.buyer.browseListings(filters), options),
    
    searchMSMEs: (query: string, filters?: any, options?: ApiClientOptions) =>
      handleApiCall(() => api.buyer.searchMSMEs(query, filters), options),
  };

  // Seller API calls
  const seller = {
    getProfile: (options?: ApiClientOptions) =>
      handleApiCall(() => api.seller.getProfile(), options),
    
    getListings: (options?: ApiClientOptions) =>
      handleApiCall(() => api.seller.getListings(), options),
    
    createListing: (data: any, options?: ApiClientOptions) =>
      handleApiCall(() => api.seller.createListing(data), options),
  };

  // Admin API calls
  const admin = {
    getDashboard: (options?: ApiClientOptions) =>
      handleApiCall(() => api.admin.getDashboard(), options),
    
    getUsers: (params?: any, options?: ApiClientOptions) =>
      handleApiCall(() => api.admin.getUsers(params), options),
  };

  return {
    auth,
    user,
    loans,
    payments,
    buyer,
    seller,
    admin,
    handleApiCall,
  };
}
