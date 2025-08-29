import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient, type ApiResponse } from "./api-client";
import { Alert } from 'react-native';
import { SessionUser } from '@msmebazaar/types/user';
import { UserRole } from '@msmebazaar/types/feature';

/**
 * Shared auth interfaces - reusing from frontend/shared
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  businessName?: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  user: SessionUser;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface UpdatePasswordRequest {
  token: string;
  newPassword: string;
}

/**
 * Mobile Auth Service - reuses frontend auth logic with mobile adaptations
 */
export class MobileAuthService {
  private readonly STORAGE_KEYS = {
    TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user_data',
    BIOMETRIC_ENABLED: 'biometric_enabled',
  };

  async login(request: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        "/auth/login",
        request
      );

      if (response.success && response.data) {
        await this.storeAuthData(response.data);
      }

      return response;
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
      throw error;
    }
  }

  async register(request: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        "/auth/register",
        request
      );

      if (response.success && response.data) {
        await this.storeAuthData(response.data);
      }

      return response;
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Failed to create account');
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      await this.clearAuthData();
    }
  }

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    try {
      const refreshToken = await AsyncStorage.getItem(this.STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        "/auth/refresh",
        { refreshToken }
      );

      if (response.success && response.data) {
        await this.storeAuthData(response.data);
      }

      return response;
    } catch (error: any) {
      await this.clearAuthData();
      throw error;
    }
  }

  async resetPassword(request: ResetPasswordRequest): Promise<ApiResponse<any>> {
    try {
      return await apiClient.post<ApiResponse<any>>(
        "/auth/reset-password",
        request
      );
    } catch (error: any) {
      Alert.alert('Reset Failed', error.message || 'Failed to send reset email');
      throw error;
    }
  }

  async verifyOTP(request: VerifyOTPRequest): Promise<ApiResponse<any>> {
    try {
      return await apiClient.post<ApiResponse<any>>(
        "/auth/verify-otp",
        request
      );
    } catch (error: any) {
      Alert.alert('Verification Failed', error.message || 'Invalid OTP');
      throw error;
    }
  }

  async updatePassword(request: UpdatePasswordRequest): Promise<ApiResponse<any>> {
    try {
      return await apiClient.post<ApiResponse<any>>(
        "/auth/update-password",
        request
      );
    } catch (error: any) {
      Alert.alert('Update Failed', error.message || 'Failed to update password');
      throw error;
    }
  }

  async getCurrentUser(): Promise<SessionUser | null> {
    try {
      const userData = await AsyncStorage.getItem(this.STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(this.STORAGE_KEYS.TOKEN);
      return !!token;
    } catch (error) {
      return false;
    }
  }

  async enableBiometric(): Promise<void> {
    await AsyncStorage.setItem(this.STORAGE_KEYS.BIOMETRIC_ENABLED, 'true');
  }

  async disableBiometric(): Promise<void> {
    await AsyncStorage.removeItem(this.STORAGE_KEYS.BIOMETRIC_ENABLED);
  }

  async isBiometricEnabled(): Promise<boolean> {
    try {
      const enabled = await AsyncStorage.getItem(this.STORAGE_KEYS.BIOMETRIC_ENABLED);
      return enabled === 'true';
    } catch (error) {
      return false;
    }
  }

  private async storeAuthData(authData: AuthResponse): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [this.STORAGE_KEYS.TOKEN, authData.token],
        [this.STORAGE_KEYS.REFRESH_TOKEN, authData.refreshToken],
        [this.STORAGE_KEYS.USER, JSON.stringify(authData.user)],
      ]);

      // Set token in API client
      await apiClient.setAuthToken(authData.token);
    } catch (error) {
      console.error('Failed to store auth data:', error);
      throw error;
    }
  }

  private async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.STORAGE_KEYS.TOKEN,
        this.STORAGE_KEYS.REFRESH_TOKEN,
        this.STORAGE_KEYS.USER,
      ]);

      // Clear token from API client
      await apiClient.clearAuthToken();
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
  }
}

// Export singleton instance
export const mobileAuthService = new MobileAuthService();

/**
 * React Query hooks for mobile auth operations
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: LoginRequest) => mobileAuthService.login(request),
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data.data?.user);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: RegisterRequest) => mobileAuthService.register(request),
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data.data?.user);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: (error: any) => {
      console.error('Registration failed:', error);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => mobileAuthService.logout(),
    onSuccess: () => {
      queryClient.clear();
      // Navigate to login screen - you can emit an event here
    },
    onError: (error: any) => {
      console.error('Logout failed:', error);
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => mobileAuthService.getCurrentUser(),
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (request: ResetPasswordRequest) => 
      mobileAuthService.resetPassword(request),
    onSuccess: () => {
      Alert.alert('Success', 'Reset link sent to your email');
    },
    onError: (error: any) => {
      console.error('Password reset failed:', error);
    },
  });
};

export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: (request: VerifyOTPRequest) => 
      mobileAuthService.verifyOTP(request),
    onSuccess: () => {
      Alert.alert('Success', 'OTP verified successfully');
    },
    onError: (error: any) => {
      console.error('OTP verification failed:', error);
    },
  });
};
