"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

/**
 * Error boundary component that catches JavaScript errors anywhere in the child component tree
 * Displays a fallback UI instead of crashing the entire application
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
    this.setState({ error, errorInfo })
    // TODO: Send to logging service
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} resetError={this.handleReset} />
      }

      // Default fallback UI
      return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Something went wrong
              </CardTitle>
              <CardDescription className="text-gray-600">
                We’re sorry, but something unexpected happened. Please try refreshing the page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="rounded-md bg-red-50 p-3">
                  <p className="text-sm font-medium text-red-800">Error Details:</p>
                  <p className="mt-1 text-xs text-red-700 font-mono">{this.state.error.message}</p>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Button onClick={this.handleReset} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()} className="w-full">
                  Refresh Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Hook-based error handler for functional components
 */
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error("Error handled:", error, errorInfo)
    // TODO: Send to logging service
  }
}

/**
 * Simple fallback component for specific use cases
 */
export function ErrorFallback({
  error,
  resetError,
}: {
  error: Error
  resetError: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-4 text-center">
      <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Oops! Something went wrong</h3>
      <p className="text-sm text-gray-600 mb-4">{error.message || "An unexpected error occurred"}</p>
      <Button onClick={resetError} size="sm">
        Try Again
      </Button>
    </div>
  )
}
