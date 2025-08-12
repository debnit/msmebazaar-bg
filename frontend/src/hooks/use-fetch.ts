"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useToast } from "@/frontend/src/hooks/use-toast"

export interface FetchOptions extends RequestInit {
  timeout?: number
  retries?: number
  retryDelay?: number
  showErrorToast?: boolean
  showSuccessToast?: boolean
  successMessage?: string
}

export interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
  status: "idle" | "loading" | "success" | "error"
}

export interface FetchReturn<T> extends FetchState<T> {
  refetch: () => Promise<void>
  mutate: (newData: T) => void
  reset: () => void
}

const DEFAULT_OPTIONS: FetchOptions = {
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
  showErrorToast: true,
  showSuccessToast: false,
}

export function useFetch<T = any>(url: string | null, options: FetchOptions = {}): FetchReturn<T> {
  const { toast } = useToast()
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
    status: "idle",
  })

  const abortControllerRef = useRef<AbortController | null>(null)
  const optionsRef = useRef({ ...DEFAULT_OPTIONS, ...options })

  const fetchData = useCallback(async () => {
    if (!url) return

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    const { timeout, retries, retryDelay, showErrorToast, showSuccessToast, successMessage, ...fetchOptions } =
      optionsRef.current

    setState((prev) => ({ ...prev, loading: true, error: null, status: "loading" }))

    let lastError: Error | null = null

    for (let attempt = 0; attempt <= retries!; attempt++) {
      try {
        const timeoutId = setTimeout(() => {
          abortControllerRef.current?.abort()
        }, timeout)

        const response = await fetch(url, {
          ...fetchOptions,
          signal: abortControllerRef.current.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const contentType = response.headers.get("content-type")
        let data: T

        if (contentType?.includes("application/json")) {
          data = await response.json()
        } else {
          data = (await response.text()) as T
        }

        setState({
          data,
          loading: false,
          error: null,
          status: "success",
        })

        if (showSuccessToast && successMessage) {
          toast({
            title: "Success",
            description: successMessage,
          })
        }

        return
      } catch (error) {
        lastError = error as Error

        if (error instanceof Error && error.name === "AbortError") {
          return // Request was cancelled
        }

        if (attempt < retries!) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay! * Math.pow(2, attempt)))
        }
      }
    }

    // All retries failed
    const errorMessage = lastError?.message || "An unexpected error occurred"
    setState({
      data: null,
      loading: false,
      error: errorMessage,
      status: "error",
    })

    if (optionsRef.current.showErrorToast) {
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }, [url, toast])

  const mutate = useCallback((newData: T) => {
    setState((prev) => ({
      ...prev,
      data: newData,
      status: "success",
    }))
  }, [])

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      status: "idle",
    })
  }, [])

  useEffect(() => {
    fetchData()

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

// Specialized hooks for different HTTP methods
export function useGet<T = any>(url: string | null, options?: Omit<FetchOptions, "method">) {
  return useFetch<T>(url, { ...options, method: "GET" })
}

export function usePost<T = any>(url: string | null, body?: any, options?: Omit<FetchOptions, "method" | "body">) {
  const [postUrl, setPostUrl] = useState<string | null>(null)
  const [postBody, setPostBody] = useState<any>(null)

  const result = useFetch<T>(postUrl, {
    ...options,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    body: postBody ? JSON.stringify(postBody) : undefined,
  })

  const execute = useCallback(
    (executeBody?: any) => {
      setPostBody(executeBody || body)
      setPostUrl(url)
    },
    [url, body],
  )

  return {
    ...result,
    execute,
  }
}

export function usePut<T = any>(url: string | null, body?: any, options?: Omit<FetchOptions, "method" | "body">) {
  const [putUrl, setPutUrl] = useState<string | null>(null)
  const [putBody, setPutBody] = useState<any>(null)

  const result = useFetch<T>(putUrl, {
    ...options,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    body: putBody ? JSON.stringify(putBody) : undefined,
  })

  const execute = useCallback(
    (executeBody?: any) => {
      setPutBody(executeBody || body)
      setPutUrl(url)
    },
    [url, body],
  )

  return {
    ...result,
    execute,
  }
}

export function useDelete<T = any>(url: string | null, options?: Omit<FetchOptions, "method">) {
  const [deleteUrl, setDeleteUrl] = useState<string | null>(null)

  const result = useFetch<T>(deleteUrl, {
    ...options,
    method: "DELETE",
  })

  const execute = useCallback(() => {
    setDeleteUrl(url)
  }, [url])

  return {
    ...result,
    execute,
  }
}
