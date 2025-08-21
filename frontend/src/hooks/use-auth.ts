"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApiService } from "@/services/auth.api";
import { useAuthStore, type RegisterData } from "@/store/auth.store";
import type { User, UserRole, SubscriptionPlan } from "@/types/user";
import { useToast } from "@/hooks/use-toast";

export interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  roles: UserRole[];
  subscription: SubscriptionPlan | null;
  isPro: boolean;

  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerification: () => Promise<boolean>;
}

export function useAuth(): UseAuthReturn {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    roles,
    subscription,
    isPro,
    login: loginStore,
    register: registerStore,
    logout: logoutStore,
    refreshUser: refreshUserStore,
    updateProfile: updateProfileStore,
    changePassword: changePasswordStore,
    forgotPassword: forgotPasswordStore,
    resetPassword: resetPasswordStore,
    verifyEmail: verifyEmailStore,
    resendVerification: resendVerificationStore,
  } = useAuthStore();

  const { toast } = useToast();
  const router = useRouter();

  // Effect to show toast on error
  useEffect(() => {
    if (error) {
      toast({
        title: "Authentication Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    roles,
    subscription,
    isPro,

    login: async (email, password) => {
      try {
        const success = await loginStore({ email, password });
        return success;
      } catch (e) {
        // Error handled inside store with toast
        return false;
      }
    },

    register: async (data) => {
      try {
        const success = await registerStore(data);
        return success;
      } catch (e) {
        return false;
      }
    },

    logout: async () => {
      logoutStore();
      router.push("/login"); // Redirect on logout, optional
    },

    refreshUser: async () => {
      try {
        await refreshUserStore();
        return true;
      } catch {
        return false;
      }
    },

    updateProfile: async (data) => {
      try {
        const success = await updateProfileStore(data);
        return success;
      } catch {
        return false;
      }
    },

    changePassword: async (currentPassword, newPassword) => {
      try {
        const success = await changePasswordStore(currentPassword, newPassword);
        return success;
      } catch {
        return false;
      }
    },

    forgotPassword: async (email) => {
      try {
        const success = await forgotPasswordStore(email);
        return success;
      } catch {
        return false;
      }
    },

    resetPassword: async (token, newPassword) => {
      try {
        const success = await resetPasswordStore(token, newPassword);
        return success;
      } catch {
        return false;
      }
    },

    verifyEmail: async (token) => {
      try {
        const success = await verifyEmailStore(token);
        return success;
      } catch {
        return false;
      }
    },

    resendVerification: async () => {
      try {
        const success = await resendVerificationStore();
        return success;
      } catch {
        return false;
      }
    },
  };
}
