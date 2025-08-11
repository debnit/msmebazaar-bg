"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useToast } from "@/hooks/use-toast"

export interface FetchOptions extends RequestInit {
  baseURL?: string
  timeout?: number
  retries?: number
  retryDelay?: number
  skipErrorToast?: boolean
}

export interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
  status: number | null
}

export interface FetchResult<T> extends FetchState<T> {
  refetch: () => Promise<void>
  mutate: (newData: T | ((prevData: T | null) => T)) => void
  reset: () => void
}

const DEFAULT_OPTIONS: FetchOptions = {
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
  skipErrorToast: false,
}

export function useFetch<T = any>(url: string | null, options: FetchOptions = {}): FetchResult<T> {
  const { toast } = useToast()
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
    status: null,
  })

  const abortControllerRef = useRef<AbortController | null>(null)
  const optionsRef = useRef({ ...DEFAULT_OPTIONS, ...options })

  // Update options ref when options change
  useEffect(() => {
    optionsRef.current = { ...DEFAULT_OPTIONS, ...options }
  }, [options])

  const fetchData = useCallback(async (): Promise<void> => {
    if (!url) return

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current

    setState((prev) => ({ ...prev, loading: true, error: null }))

    const {
      baseURL = process.env.NEXT_PUBLIC_API_URL || "",
      timeout,
      retries,
      retryDelay,
      skipErrorToast,
      ...fetchOptions
    } = optionsRef.current

    const fullUrl = url.startsWith("http") ? url : `${baseURL}${url}`

    let lastError: Error | null = null

    for (let attempt = 0; attempt <= retries!; attempt++) {
      try {
        // Create timeout promise
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("Request timeout")), timeout)
        })

        // Make the fetch request
        const fetchPromise = fetch(fullUrl, {
          ...fetchOptions,
          signal,
          headers: {
            "Content-Type": "application/json",
            ...fetchOptions.headers,
          },
        })

        const response = await Promise.race([fetchPromise, timeoutPromise])

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const contentType = response.headers.get("content-type")
        let data: T

        if (contentType?.includes("application/json")) {
          data = await response.json()
        } else {
          data = (await response.text()) as unknown as T
        }

        setState({
          data,
          loading: false,
          error: null,
          status: response.status,
        })

        return
      } catch (error) {
        lastError = error as Error

        // Don't retry if request was aborted
        if (signal.aborted) {
          return
        }

        // Don't retry on client errors (4xx)
        if (error instanceof Error && error.message.includes("HTTP 4")) {
          break
        }

        // Wait before retrying (except on last attempt)
        if (attempt < retries!) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay! * (attempt + 1)))
        }
      }
    }

    // All retries failed
    const errorMessage = lastError?.message || "An unexpected error occurred"

    setState({
      data: null,
      loading: false,
      error: errorMessage,
      status: null,
    })

    if (!skipErrorToast) {
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }, [url, toast])

  const mutate = useCallback((newData: T | ((prevData: T | null) => T)) => {
    setState((prev) => ({
      ...prev,
      data: typeof newData === "function" ? (newData as (prevData: T | null) => T)(prev.data) : newData,
    }))
  }, [])

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setState({
      data: null,
      loading: false,
      error: null,
      status: null,
    })
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchData()

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchData])

  return {
    ...state,
    refetch: fetchData,
    mutate,
    reset,
  }
}

// Specialized hooks for common HTTP methods
export function useGet<T = any>(url: string | null, options?: FetchOptions) {
  return useFetch<T>(url, { ...options, method: "GET" })
}

export function usePost<T = any>() {
  const { toast } = useToast()
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
    status: null,
  })

  const post = useCallback(
    async (url: string, body?: any, options: FetchOptions = {}): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const {
        baseURL = process.env.NEXT_PUBLIC_API_URL || "",
        timeout = 30000,
        skipErrorToast = false,
        ...fetchOptions
      } = options

      const fullUrl = url.startsWith("http") ? url : `${baseURL}${url}`

      try {
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("Request timeout")), timeout)
        })

        const fetchPromise = fetch(fullUrl, {
          ...fetchOptions,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...fetchOptions.headers,
          },
          body: body ? JSON.stringify(body) : undefined,
        })

        const response = await Promise.race([fetchPromise, timeoutPromise])

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const contentType = response.headers.get("content-type")
        let data: T

        if (contentType?.includes("application/json")) {
          data = await response.json()
        } else {
          data = (await response.text()) as unknown as T
        }

        setState({
          data,
          loading: false,
          error: null,
          status: response.status,
        })

        return data
      } catch (error) {
        const errorMessage = (error as Error).message || "An unexpected error occurred"

        setState({
          data: null,
          loading: false,
          error: errorMessage,
          status: null,
        })

        if (!skipErrorToast) {
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          })
        }

        return null
      }
    },
    [toast],
  )

  return { ...state, post }
}

export function usePut<T = any>() {
  const { toast } = useToast()
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
    status: null,
  })

  const put = useCallback(
    async (url: string, body?: any, options: FetchOptions = {}): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const {
        baseURL = process.env.NEXT_PUBLIC_API_URL || "",
        timeout = 30000,
        skipErrorToast = false,
        ...fetchOptions
      } = options

      const fullUrl = url.startsWith("http") ? url : `${baseURL}${url}`

      try {
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("Request timeout")), timeout)
        })

        const fetchPromise = fetch(fullUrl, {
          ...fetchOptions,
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...fetchOptions.headers,
          },
          body: body ? JSON.stringify(body) : undefined,
        })

        const response = await Promise.race([fetchPromise, timeoutPromise])

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const contentType = response.headers.get("content-type")
        let data: T

        if (contentType?.includes("application/json")) {
          data = await response.json()
        } else {
          data = (await response.text()) as unknown as T
        }

        setState({
          data,
          loading: false,
          error: null,
          status: response.status,
        })

        return data
      } catch (error) {
        const errorMessage = (error as Error).message || "An unexpected error occurred"

        setState({
          data: null,
          loading: false,
          error: errorMessage,
          status: null,
        })

        if (!skipErrorToast) {
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          })
        }

        return null
      }
    },
    [toast],
  )

  return { ...state, put }
}

export function useDelete<T = any>() {
  const { toast } = useToast()
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
    status: null,
  })

  const del = useCallback(
    async (url: string, options: FetchOptions = {}): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const {
        baseURL = process.env.NEXT_PUBLIC_API_URL || "",
        timeout = 30000,
        skipErrorToast = false,
        ...fetchOptions
      } = options

      const fullUrl = url.startsWith("http") ? url : `${baseURL}${url}`

      try {
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("Request timeout")), timeout)
        })

        const fetchPromise = fetch(fullUrl, {
          ...fetchOptions,
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...fetchOptions.headers,
          },
        })

        const response = await Promise.race([fetchPromise, timeoutPromise])

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const contentType = response.headers.get("content-type")
        let data: T

        if (contentType?.includes("application/json")) {
          data = await response.json()
        } else {
          data = (await response.text()) as unknown as T
        }

        setState({
          data,
          loading: false,
          error: null,
          status: response.status,
        })

        return data
      } catch (error) {
        const errorMessage = (error as Error).message || "An unexpected error occurred"

        setState({
          data: null,
          loading: false,
          error: errorMessage,
          status: null,
        })

        if (!skipErrorToast) {
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          })
        }

        return null
      }
    },
    [toast],
  )

  return { ...state, delete: del }
}
