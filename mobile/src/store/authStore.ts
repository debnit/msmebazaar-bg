import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SessionUser } from "@shared/types/user";
import { apiClient } from "@mobile/api/apiClient";

interface AuthState {
  user: SessionUser | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: SessionUser | null) => void;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  
  login: async (email, password) => {
    try {
      const response = await apiClient.post<{
        token: string;
        user: SessionUser;
      }>("/auth/login", { email, password });
      
      await AsyncStorage.setItem("auth_token", response.token);
      await AsyncStorage.setItem("user_data", JSON.stringify(response.user));
      
      set({ token: response.token, user: response.user });
    } catch (error) {
      throw error;
    }
  },
  
  logout: async () => {
    await AsyncStorage.removeItem("auth_token");
    await AsyncStorage.removeItem("user_data");
    set({ user: null, token: null });
  },
  
  loadStoredAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      const userData = await AsyncStorage.getItem("user_data");
      
      if (token && userData) {
        set({
          token,
          user: JSON.parse(userData),
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));

// React context wrapper for easier component usage
import React, { createContext, useContext, useEffect } from "react";

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const store = useAuthStore();
  
  useEffect(() => {
    store.loadStoredAuth();
  }, []);
  
  return (
    <AuthContext.Provider value={store}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}