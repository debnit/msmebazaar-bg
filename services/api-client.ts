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
}

/**
 * API request options interface
 */
interface ApiRequestOptions extends RequestInit {
  requiresAuth?: boolean
  timeout?: number
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

/**
 * Main API client class for MSMEBazaar
 * Handles authentication, request/response interceptors, and error handling
 */
class ApiClient {
  private baseURL: string

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
      const errorMessage = data?.message || data?.error || `HTTP ${response.status}`
      throw new ApiError(errorMessage, response.status, data)
    }

    return data
  }

  /**
   * Make HTTP request with timeout and error handling
   */
  private async request<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const { timeout = 10000, requiresAuth = true, ...fetchOptions } = options

    const url = `${this.baseURL}${endpoint}`
    const headers = this.buildHeaders(options)

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
        throw error
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new ApiError("Request timeout", 408)
        }
        throw new ApiError(error.message, 0)
      }

      throw new ApiError("Unknown error occurred", 0)
    }
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
    const { requiresAuth = true, ...fetchOptions } = options || {}

    const headers: HeadersInit = {}

    // Add auth token if required
    if (requiresAuth) {
      const token = this.getAuthToken()
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
    }

    const url = `${this.baseURL}${endpoint}`

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        method: "POST",
        headers,
        body: formData,
      })

      return await this.handleResponse<T>(response)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError("Upload failed", 0)
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export types for use in other files
export type { ApiResponse, ApiRequestOptions }
