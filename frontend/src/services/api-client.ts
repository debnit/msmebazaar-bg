"use client";

import { toast } from "@/hooks/use-toast";
import type {
  LoanApplicationResponse,
  LoanListResponse,
  LoanApplicationForm,
} from "@/types/loan";
import type { Product, Recommendation, ChatSession } from "@/types/marketplace";
import type { Order } from "@/types/orders";
import type { User } from "@/types/user"; // assuming you have this
import * as matchmakingApi from "./matchmaking.api";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  meta?: { total?: number; page?: number; limit?: number; totalPages?: number };
}

export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  defaultHeaders?: Record<string, string>;
  onUnauthorized?: () => void;
  onError?: (error: ApiError) => void;
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

class ApiClient {
  private config: Required<ApiClientConfig>;
  private authToken: string | null = null;
  constructor(config: ApiClientConfig = {}) {
    this.config = {
      baseURL: config.baseURL || process.env.NEXT_PUBLIC_API_URL || "",
      timeout: config.timeout || 30000,
      retries: config.retries || 3,
      retryDelay: config.retryDelay || 1000,
      defaultHeaders: { "Content-Type": "application/json", Accept: "application/json", ...config.defaultHeaders },
      onUnauthorized: config.onUnauthorized || (() => {}),
      onError: config.onError || (() => {}),
    };
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
  public getAuthToken() { return this.authToken; }
  private getHeaders(custom?: Record<string, string>) {
    const headers = { ...this.config.defaultHeaders, ...custom };
    if (this.authToken) headers.Authorization = `Bearer ${this.authToken}`;
    return headers;
  }
  private async makeRequest<T>(url: string, options: RequestInit = {}, attempt = 1): Promise<ApiResponse<T>> {
    const fullUrl = url.startsWith("http") ? url : `${this.config.baseURL}${url}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
    try {
      const response = await fetch(fullUrl, { ...options, headers: this.getHeaders(options.headers as any), signal: controller.signal });
      clearTimeout(timeoutId);
      let data: any = {};
      const contentType = response.headers.get("content-type");
      data = contentType?.includes("application/json") ? await response.json() : await response.text();
      if (response.ok) return { success: true, data: data.data || data, message: data.message, meta: data.meta };
      const err = new ApiError(data?.message || data?.error || `HTTP ${response.status}`, response.status, data?.code, data?.errors);
      if (response.status === 401) { this.setAuthToken(null); this.config.onUnauthorized(); }
      if (([408, 429].includes(response.status) || response.status >= 500) && attempt <= this.config.retries) {
        await this.delay(this.config.retryDelay * Math.pow(2, attempt - 1));
        return this.makeRequest<T>(url, options, attempt + 1);
      }
      throw err;
    } catch (error) {
      clearTimeout(timeoutId);
      const err = error instanceof ApiError ? error : new ApiError(error instanceof Error ? error.message : "Unknown error", 0);
      if (attempt <= this.config.retries) {
        await this.delay(this.config.retryDelay * Math.pow(2, attempt - 1));
        return this.makeRequest<T>(url, options, attempt + 1);
      }
      this.config.onError(err);
      throw err;
    }
  }
  private delay(ms: number) { return new Promise(res => setTimeout(res, ms)); }
  public get<T>(url: string, params?: Record<string, any>) {
    let fullUrl = url;
    if (params) {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k,v]) => { if (v != null) qs.append(k, String(v)); });
      fullUrl += `?${qs.toString()}`;
    }
    return this.makeRequest<T>(fullUrl, { method: "GET" });
  }
  public post<T>(url: string, data?: any) {
    return this.makeRequest<T>(url, { method: "POST", body: data instanceof FormData ? data : data ? JSON.stringify(data) : undefined });
  }
  public put<T>(url: string, data?: any) {
    return this.makeRequest<T>(url, { method: "PUT", body: JSON.stringify(data) });
  }
  public patch<T>(url: string, data?: any) {
    return this.makeRequest<T>(url, { method: "PATCH", body: JSON.stringify(data) });
  }
  public delete<T>(url: string) { return this.makeRequest<T>(url, { method: "DELETE" }); }
  public upload<T>(url: string, file: File, additional?: Record<string, any>) {
    const formData = new FormData();
    formData.append("file", file);
    if (additional) Object.entries(additional).forEach(([k,v]) => formData.append(k, String(v)));
    return this.makeRequest<T>(url, { method: "POST", body: formData });
  }
}

const apiClient = new ApiClient({
  onUnauthorized: () => { if (typeof window !== "undefined") window.location.href = "/login"; },
  onError: (err) => { if (err.status !== 422) toast({ title: "Error", description: err.message, variant: "destructive" }); },
});

export default apiClient;

export const api = {
  auth: {
    login: (c: { email: string; password: string }) => apiClient.post("/auth/login", c),
    register: (d: any) => apiClient.post("/auth/register", d),
    logout: () => apiClient.post("/auth/logout"),
    refreshToken: () => apiClient.post("/auth/refresh"),
    forgotPassword: (email: string) => apiClient.post("/auth/forgot-password", { email }),
    resetPassword: (token: string, password: string) => apiClient.post("/auth/reset-password", { token, password }),
    verifyEmail: (token: string) => apiClient.post("/auth/verify-email", { token }),
  },
  user: {
    getProfile: () => apiClient.get("/user/profile"),
    updateProfile: (d: any) => apiClient.put("/user/profile", d),
    changePassword: (d: { currentPassword: string; newPassword: string }) => apiClient.put("/user/change-password", d),
    uploadAvatar: (f: File) => apiClient.upload("/user/avatar", f),
  },
  business: {
    getProfile: () => apiClient.get("/business/profile"),
    updateProfile: (d: any) => apiClient.put("/business/profile", d),
    uploadDocument: (type: string, f: File) => apiClient.upload("/business/documents", f, { type }),
    getDocuments: () => apiClient.get("/business/documents"),
    verifyGST: (gst: string) => apiClient.post("/business/verify-gst", { gstNumber: gst }),
  },
  payments: {
    createOrder: (d: any) => apiClient.post("/payments/orders", d),
    verifyPayment: (d: any) => apiClient.post("/payments/verify", d),
    getTransactions: (p?: any) => apiClient.get("/payments/transactions", p),
    getInvoices: (p?: any) => apiClient.get("/payments/invoices", p),
  },
  marketplace: {
    getProducts: (p?: any) => apiClient.get<Product[]>("/marketplace/products", p),
    getProduct: (id: string) => apiClient.get<Product>(`/marketplace/products/${id}`),
    searchProducts: (query: string, filters?: any) => apiClient.get<Product[]>("/marketplace/search", { query, ...filters }),
    getCategories: () => apiClient.get("/marketplace/categories"),
    getVendors: (p?: any) => apiClient.get("/marketplace/vendors", p),
    getVendor: (id: string) => apiClient.get(`/marketplace/vendors/${id}`),
  },
  messaging: {
    getInvestorChats: () => apiClient.get<ChatSession[]>("/messaging/investor"),
    sendMessage: (chatId: string, content: string) => apiClient.post(`/messaging/${chatId}`, { content }),
  },
  orders: {
    create: (d: any) => apiClient.post<Order>("/orders", d),
    get: (id: string) => apiClient.get<Order>(`/orders/${id}`),
    list: (p?: any) => apiClient.get<Order[]>("/orders", p),
    update: (id: string, d: any) => apiClient.put(`/orders/${id}`, d),
    cancel: (id: string, reason?: string) => apiClient.post(`/orders/${id}/cancel`, { reason }),
  },
  loans: {
    apply: (d: LoanApplicationForm) => apiClient.post<LoanApplicationResponse>("/loans/applications", d),
    getApplications: (p?: Record<string, any>) => apiClient.get<LoanListResponse>("/loans/applications", p),
    getApplication: (id: string) => apiClient.get<LoanApplicationResponse>(`/loans/applications/${id}`),
    uploadDocument: (applicationId: string, type: string, f: File) => apiClient.upload(`/loans/applications/${applicationId}/documents`, f, { type }),
    getEligibility: (d: any) => apiClient.post("/loans/eligibility", d),
    fetchLoanStatus: (loanId: string) => apiClient.get<LoanApplicationResponse>(`/loans/${loanId}`),
    listLoans: (page = 1) => apiClient.get<LoanListResponse>("/loans", { page }),
  },
  analytics: {
    getDashboard: (p?: any) => apiClient.get("/analytics/dashboard", p),
    getBusinessMetrics: (p?: any) => apiClient.get("/analytics/business", p),
    getPaymentMetrics: (p?: any) => apiClient.get("/analytics/payments", p),
    trackEvent: (event: string, d?: any) => apiClient.post("/analytics/events", { event, d }),
  },
  notifications: {
    list: (p?: any) => apiClient.get("/notifications", p),
    markAsRead: (id: string) => apiClient.put(`/notifications/${id}/read`),
    markAllAsRead: () => apiClient.put("/notifications/read-all"),
    getPreferences: () => apiClient.get("/notifications/preferences"),
    updatePreferences: (d: any) => apiClient.put("/notifications/preferences", d),
  },
  admin: {
    getFeatures: () => apiClient.get("/admin/features"),
    updateFeature: (id: string, d: any) => apiClient.put(`/admin/features/${id}`, d),
    getUsers: (p?: any) => apiClient.get<User[]>("/admin/users", p),
    updateUser: (id: string, d: Partial<User>) => apiClient.put(`/admin/users/${id}`, d),
  },
  valuation: {
    calculate: (d: { turnover: number }) => apiClient.post<{ valuation: number }>("/business-valuation/calculate", d),
  },
  compliance: {
    getList: () => apiClient.get("/compliance/checklist"),
  },
  exitStrategy: {
    getPrograms: () => apiClient.get("/exit-strategy/programs"),
  },
  training: {
    getCatalog: () => apiClient.get("/leadership-training/catalog"),
  },
  marketLinkage: {
    getMarkets: () => apiClient.get("/market-linkage"),
  },
  deals: {
    list: (p?: any) => apiClient.get("/deals", p),
  },
  crm: {
    getPipeline: () => apiClient.get("/crm/pipeline"),
  },
  superadmin: {
    getSystemHealth: () => apiClient.get("/superadmin/system-health"),
    databaseOps: (action: string) => apiClient.post("/superadmin/database", { action }),
  },
  recommendation: {
    getListings: (params: { role: string; userId: string; k?: number }) =>
      apiClient.get<{ items: Recommendation[] }>("/recommendations/listings", params),
    logUserEvent: (event: any) => apiClient.post("/recommendations/events", event),
  },
  matchmaking: {
    // Expose the function exported above
    getMatchesForMsme: matchmakingApi.getMatchesForMsme,
    // add other matchmaking endpoints as needed
  },
};

export type { ApiResponse, ApiClientConfig };
