import { useAuthStore } from "@/store/auth.store"

/**
 * Base API configuration
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

/**
 * API response wrapper interface
 */
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

/**
 * API request options interface
 */
interface ApiRequestOptions extends RequestInit {
  requiresAuth?: boolean
  timeout?: number
  retries?: number
  retryDelay?: number
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any,
    public errors?: Record<string, string[]>,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

/**
 * Main API client class for MSMEBazaar
 * Handles authentication, request/response interceptors, error handling, and retry logic
 */
class ApiClient {
  private baseURL: string
  private defaultRetries = 3
  private defaultRetryDelay = 1000

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  /**
   * Get authentication token from store
   */
  private getAuthToken(): string | null {
    return useAuthStore.getState().token
  }

  /**
   * Build request headers with authentication and content type
   */
  private buildHeaders(options: ApiRequestOptions = {}): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    // Add auth token if required and available
    if (options.requiresAuth !== false) {
      const token = this.getAuthToken()
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
    }

    return headers
  }

  /**
   * Handle API response and errors
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type")
    const isJson = contentType?.includes("application/json")

    let data: any
    try {
      data = isJson ? await response.json() : await response.text()
    } catch (error) {
      throw new ApiError("Failed to parse response", response.status)
    }

    if (!response.ok) {
      // Handle 401 Unauthorized - clear auth state
      if (response.status === 401) {
        useAuthStore.getState().logout()
      }

      const errorMessage = data?.message || data?.error || `HTTP ${response.status}`
      const errors = data?.errors || undefined

      throw new ApiError(errorMessage, response.status, data, errors)
    }

    return data
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: ApiError): boolean {
    // Retry on network errors, timeouts, and 5xx server errors
    return (
      error.status === 0 || // Network error
      error.status === 408 || // Timeout
      error.status === 429 || // Rate limit
      (error.status >= 500 && error.status < 600) // Server errors
    )
  }

  /**
   * Make HTTP request with timeout, retry logic, and error handling
   */
  private async request<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const {
      timeout = 10000,
      requiresAuth = true,
      retries = this.defaultRetries,
      retryDelay = this.defaultRetryDelay,
      ...fetchOptions
    } = options

    const url = `${this.baseURL}${endpoint}`
    const headers = this.buildHeaders(options)

    let lastError: ApiError | null = null

    // Retry logic
    for (let attempt = 0; attempt <= retries; attempt++) {
      // Create abort controller for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      try {
        const response = await fetch(url, {
          ...fetchOptions,
          headers,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        return await this.handleResponse<T>(response)
      } catch (error) {
        clearTimeout(timeoutId)

        if (error instanceof ApiError) {
          lastError = error
        } else if (error instanceof Error) {
          if (error.name === "AbortError") {
            lastError = new ApiError("Request timeout", 408)
          } else {
            lastError = new ApiError(error.message, 0)
          }
        } else {
          lastError = new ApiError("Unknown error occurred", 0)
        }

        // Don't retry on the last attempt or non-retryable errors
        if (attempt === retries || !this.isRetryableError(lastError)) {
          break
        }

        // Wait before retrying with exponential backoff
        const delay = retryDelay * Math.pow(2, attempt)
        await this.sleep(delay)
      }
    }

    throw lastError
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" })
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" })
  }

  /**
   * Upload file with multipart/form-data
   */
  async upload<T>(endpoint: string, formData: FormData, options?: Omit<ApiRequestOptions, "headers">): Promise<T> {
    const { requiresAuth = true, timeout = 30000, ...fetchOptions } = options || {}

    const headers: HeadersInit = {}

    // Add auth token if required
    if (requiresAuth) {
      const token = this.getAuthToken()
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
    }

    const url = `${this.baseURL}${endpoint}`

    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        method: "POST",
        headers,
        body: formData,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      return await this.handleResponse<T>(response)
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof ApiError) {
        throw error
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new ApiError("Upload timeout", 408)
      }

      throw new ApiError("Upload failed", 0)
    }
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.get("/health", { requiresAuth: false, timeout: 5000 })
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export types for use in other files
export type { ApiResponse, ApiRequestOptions }


/* "use client"

import { toast } from "@/hooks/use-toast"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
  meta?: {
    total?: number
    page?: number
    limit?: number
    totalPages?: number
  }
}

export interface ApiClientConfig {
  baseURL?: string
  timeout?: number
  retries?: number
  retryDelay?: number
  defaultHeaders?: Record<string, string>
  onUnauthorized?: () => void
  onError?: (error: ApiError) => void
}

export class ApiError extends Error {
  public status: number
  public code?: string
  public errors?: Record<string, string[]>

  constructor(message: string, status: number, code?: string, errors?: Record<string, string[]>) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.code = code
    this.errors = errors
  }
}

class ApiClient {
  private config: Required<ApiClientConfig>
  private authToken: string | null = null

  constructor(config: ApiClientConfig = {}) {
    this.config = {
      baseURL: config.baseURL || process.env.NEXT_PUBLIC_API_URL || "",
      timeout: config.timeout || 30000,
      retries: config.retries || 3,
      retryDelay: config.retryDelay || 1000,
      defaultHeaders: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...config.defaultHeaders,
      },
      onUnauthorized: config.onUnauthorized || (() => {}),
      onError: config.onError || (() => {}),
    }

    // Initialize auth token from localStorage if available
    if (typeof window !== "undefined") {
      this.authToken = localStorage.getItem("auth_token")
    }
  }

  public setAuthToken(token: string | null) {
    this.authToken = token
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("auth_token", token)
      } else {
        localStorage.removeItem("auth_token")
      }
    }
  }

  public getAuthToken(): string | null {
    return this.authToken
  }

  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers = { ...this.config.defaultHeaders, ...customHeaders }

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`
    }

    return headers
  }

  private async makeRequest<T>(url: string, options: RequestInit = {}, attempt = 1): Promise<ApiResponse<T>> {
    const fullUrl = url.startsWith("http") ? url : `${this.config.baseURL}${url}`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers: this.getHeaders(options.headers as Record<string, string>),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Handle different response types
      let responseData: any
      const contentType = response.headers.get("content-type")

      if (contentType?.includes("application/json")) {
        responseData = await response.json()
      } else {
        responseData = await response.text()
      }

      // Handle successful responses
      if (response.ok) {
        return {
          success: true,
          data: responseData.data || responseData,
          message: responseData.message,
          meta: responseData.meta,
        }
      }

      // Handle error responses
      const errorMessage =
        responseData.message || responseData.error || `HTTP ${response.status}: ${response.statusText}`
      const apiError = new ApiError(errorMessage, response.status, responseData.code, responseData.errors)

      // Handle specific status codes
      if (response.status === 401) {
        this.setAuthToken(null)
        this.config.onUnauthorized()
        throw apiError
      }

      if (response.status === 422) {
        // Validation errors
        throw apiError
      }

      // Retry on server errors (5xx) and some client errors
      if (
        (response.status >= 500 || response.status === 408 || response.status === 429) &&
        attempt <= this.config.retries
      ) {
        await this.delay(this.config.retryDelay * Math.pow(2, attempt - 1))
        return this.makeRequest<T>(url, options, attempt + 1)
      }

      throw apiError
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof ApiError) {
        this.config.onError(error)
        throw error
      }

      if (error instanceof Error && error.name === "AbortError") {
        const timeoutError = new ApiError("Request timeout", 408)
        this.config.onError(timeoutError)
        throw timeoutError
      }

      // Network errors - retry if attempts remaining
      if (attempt <= this.config.retries) {
        await this.delay(this.config.retryDelay * Math.pow(2, attempt - 1))
        return this.makeRequest<T>(url, options, attempt + 1)
      }

      const networkError = new ApiError(error instanceof Error ? error.message : "Network error occurred", 0)
      this.config.onError(networkError)
      throw networkError
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // HTTP Methods
  public async get<T = any>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let fullUrl = url
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          searchParams.append(key, String(value))
        }
      })
      fullUrl += `?${searchParams.toString()}`
    }

    return this.makeRequest<T>(fullUrl, { method: "GET" })
  }

  public async post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  public async put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  public async patch<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  public async delete<T = any>(url: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { method: "DELETE" })
  }

  // File upload method
  public async upload<T = any>(url: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append("file", file)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
    }

    return this.makeRequest<T>(url, {
      method: "POST",
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
    })
  }

  // Batch requests
  public async batch<T = any>(requests: Array<{ url: string; method: string; data?: any }>): Promise<ApiResponse<T[]>> {
    return this.post<T[]>("/batch", { requests })
  }
}

// Create singleton instance
const apiClient = new ApiClient({
  onUnauthorized: () => {
    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
  },
  onError: (error) => {
    // Show error toast for non-validation errors
    if (error.status !== 422) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  },
})

export default apiClient

// Convenience methods for common API patterns
export const api = {
  // Authentication
  auth: {
    login: (credentials: { email: string; password: string }) => apiClient.post("/auth/login", credentials),
    register: (userData: any) => apiClient.post("/auth/register", userData),
    logout: () => apiClient.post("/auth/logout"),
    refreshToken: () => apiClient.post("/auth/refresh"),
    forgotPassword: (email: string) => apiClient.post("/auth/forgot-password", { email }),
    resetPassword: (token: string, password: string) => apiClient.post("/auth/reset-password", { token, password }),
    verifyEmail: (token: string) => apiClient.post("/auth/verify-email", { token }),
  },

  // User management
  user: {
    getProfile: () => apiClient.get("/user/profile"),
    updateProfile: (data: any) => apiClient.put("/user/profile", data),
    changePassword: (data: { currentPassword: string; newPassword: string }) =>
      apiClient.put("/user/change-password", data),
    uploadAvatar: (file: File) => apiClient.upload("/user/avatar", file),
  },

  // Business management
  business: {
    getProfile: () => apiClient.get("/business/profile"),
    updateProfile: (data: any) => apiClient.put("/business/profile", data),
    uploadDocument: (type: string, file: File) => apiClient.upload("/business/documents", file, { type }),
    getDocuments: () => apiClient.get("/business/documents"),
    verifyGST: (gstNumber: string) => apiClient.post("/business/verify-gst", { gstNumber }),
  },

  // Payments
  payments: {
    createOrder: (data: any) => apiClient.post("/payments/orders", data),
    verifyPayment: (data: any) => apiClient.post("/payments/verify", data),
    getTransactions: (params?: any) => apiClient.get("/payments/transactions", params),
    getInvoices: (params?: any) => apiClient.get("/payments/invoices", params),
  },

  // Marketplace
  marketplace: {
    getProducts: (params?: any) => apiClient.get("/marketplace/products", params),
    getProduct: (id: string) => apiClient.get(`/marketplace/products/${id}`),
    searchProducts: (query: string, filters?: any) => apiClient.get("/marketplace/search", { query, ...filters }),
    getCategories: () => apiClient.get("/marketplace/categories"),
    getVendors: (params?: any) => apiClient.get("/marketplace/vendors", params),
    getVendor: (id: string) => apiClient.get(`/marketplace/vendors/${id}`),
  },

  // Orders
  orders: {
    create: (data: any) => apiClient.post("/orders", data),
    get: (id: string) => apiClient.get(`/orders/${id}`),
    list: (params?: any) => apiClient.get("/orders", params),
    update: (id: string, data: any) => apiClient.put(`/orders/${id}`, data),
    cancel: (id: string, reason?: string) => apiClient.post(`/orders/${id}/cancel`, { reason }),
  },

  // Loans
  loans: {
    apply: (data: any) => apiClient.post("/loans/applications", data),
    getApplications: (params?: any) => apiClient.get("/loans/applications", params),
    getApplication: (id: string) => apiClient.get(`/loans/applications/${id}`),
    uploadDocument: (applicationId: string, type: string, file: File) =>
      apiClient.upload(`/loans/applications/${applicationId}/documents`, file, { type }),
    getEligibility: (data: any) => apiClient.post("/loans/eligibility", data),
  },

  // Analytics
  analytics: {
    getDashboard: (params?: any) => apiClient.get("/analytics/dashboard", params),
    getBusinessMetrics: (params?: any) => apiClient.get("/analytics/business", params),
    getPaymentMetrics: (params?: any) => apiClient.get("/analytics/payments", params),
    trackEvent: (event: string, data?: any) => apiClient.post("/analytics/events", { event, data }),
  },

  // Notifications
  notifications: {
    list: (params?: any) => apiClient.get("/notifications", params),
    markAsRead: (id: string) => apiClient.put(`/notifications/${id}/read`),
    markAllAsRead: () => apiClient.put("/notifications/read-all"),
    getPreferences: () => apiClient.get("/notifications/preferences"),
    updatePreferences: (data: any) => apiClient.put("/notifications/preferences", data),
  },
}

// Export types
export type { ApiResponse, ApiClientConfig }
*/
