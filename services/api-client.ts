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
