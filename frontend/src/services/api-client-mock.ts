"use client";

import { toast } from "@/hooks/use-toast";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  meta?: { total?: number; page?: number; limit?: number; totalPages?: number };
}

export class ApiError extends Error {
  public status: number;
  public code?: string;
  public errors?: Record<string, string[]>;
  constructor(message: string, status: number, code?: string, errors?: Record<string,string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

class MockApiClient {
  private baseURL: string;
  private authToken: string | null = null;

  constructor() {
    this.baseURL = '/api/mock-gateway';
    if (typeof window !== "undefined") {
      this.authToken = localStorage.getItem("auth_token");
    }
  }

  public setAuthToken(token: string | null) {
    this.authToken = token;
    if (typeof window !== "undefined") {
      if (token) localStorage.setItem("auth_token", token);
      else localStorage.removeItem("auth_token");
    }
  }

  private async makeRequest<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}?path=${encodeURIComponent(path)}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data: data.data || data, message: data.message, meta: data.meta };
      }

      throw new ApiError(data?.message || data?.error || `HTTP ${response.status}`, response.status, data?.code, data?.errors);
    } catch (error) {
      const err = error instanceof ApiError ? error : new ApiError(error instanceof Error ? error.message : "Unknown error", 0);
      throw err;
    }
  }

  public get<T>(path: string, params?: Record<string, any>) {
    let fullPath = path;
    if (params) {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k,v]) => { if (v != null) qs.append(k, String(v)); });
      fullPath += `?${qs.toString()}`;
    }
    return this.makeRequest<T>(fullPath, { method: "GET" });
  }

  public post<T>(path: string, data?: any) {
    return this.makeRequest<T>(path, { 
      method: "POST", 
      body: data ? JSON.stringify(data) : undefined 
    });
  }

  public put<T>(path: string, data?: any) {
    return this.makeRequest<T>(path, { 
      method: "PUT", 
      body: JSON.stringify(data) 
    });
  }

  public delete<T>(path: string) { 
    return this.makeRequest<T>(path, { method: "DELETE" }); 
  }
}

const mockApiClient = new MockApiClient();

export const mockApi = {
  auth: {
    login: (c: { email: string; password: string }) => mockApiClient.post("/auth/login", c),
    register: (d: any) => mockApiClient.post("/auth/register", d),
    logout: () => mockApiClient.post("/auth/logout"),
    refreshToken: () => mockApiClient.post("/auth/refresh"),
    forgotPassword: (email: string) => mockApiClient.post("/auth/forgot-password", { email }),
    resetPassword: (token: string, password: string) => mockApiClient.post("/auth/reset-password", { token, password }),
    verifyEmail: (token: string) => mockApiClient.post("/auth/verify-email", { token }),
  },
  marketplace: {
    getProducts: (p?: any) => mockApiClient.get("/marketplace/products", p),
    getProduct: (id: string) => mockApiClient.get(`/marketplace/products/${id}`),
    searchProducts: (query: string, filters?: any) => mockApiClient.get("/marketplace/search", { query, ...filters }),
  },
  user: {
    getProfile: () => mockApiClient.get("/user/profile"),
    updateProfile: (d: any) => mockApiClient.put("/user/profile", d),
  },
  loans: {
    apply: (d: any) => mockApiClient.post("/loans/applications", d),
    getApplications: (p?: Record<string, any>) => mockApiClient.get("/loans/applications", p),
  },
  payments: {
    createOrder: (d: any) => mockApiClient.post("/payments/orders", d),
    verifyPayment: (d: any) => mockApiClient.post("/payments/verify", d),
  },
};

