import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

/**
 * Axios instance with interceptors for auth and error handling
 */
class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("auth_token")
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    // Response interceptor - Handle auth errors and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const refreshToken = localStorage.getItem("refresh_token")
            if (refreshToken) {
              const response = await this.client.post("/auth/refresh", {
                refreshToken,
              })

              const { token } = response.data
              localStorage.setItem("auth_token", token)

              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${token}`
              return this.client(originalRequest)
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem("auth_token")
            localStorage.removeItem("refresh_token")
            window.location.href = "/login"
            return Promise.reject(refreshError)
          }
        }

        // Handle network errors
        if (!error.response) {
          error.message = "Network error. Please check your connection."
        }

        return Promise.reject(error)
      },
    )
  }

  // HTTP methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config)
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config)
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config)
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config)
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config)
  }

  // File upload helper
  async uploadFile<T = any>(
    url: string,
    file: File,
    onUploadProgress?: (progressEvent: any) => void,
  ): Promise<AxiosResponse<T>> {
    const formData = new FormData()
    formData.append("file", file)

    return this.client.post<T>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    })
  }

  // Get client instance for advanced usage
  getClient(): AxiosInstance {
    return this.client
  }
}

export const apiClient = new ApiClient()