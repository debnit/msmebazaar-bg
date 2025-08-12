"use client"

import React, { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react"
import { toast } from "@/frontend/src/hooks/use-toast"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showDetails?: boolean
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: "",
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Generate unique error ID for tracking
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return {
      hasError: true,
      error,
      errorId,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo)
    }

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Log error to external service (in production)
    this.logErrorToService(error, errorInfo)

    // Show toast notification
    toast({
      title: "Something went wrong",
      description: "An unexpected error occurred. Please try refreshing the page.",
      variant: "destructive",
    })
  }

  private logErrorToService = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      // In production, send error to logging service
      if (process.env.NODE_ENV === "production") {
        const errorData = {
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          errorId: this.state.errorId,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          userId: localStorage.getItem("userId") || "anonymous",
        }

        // Send to your error tracking service (e.g., Sentry, LogRocket, etc.)
        await fetch("/api/errors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(errorData),
        }).catch(() => {
          // Silently fail if error logging fails
        })
      }
    } catch (loggingError) {
      console.error("Failed to log error:", loggingError)
    }
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: "",
    })
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = "/"
  }

  private copyErrorDetails = () => {
    const errorDetails = {
      errorId: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
    }

    navigator.clipboard
      .writeText(JSON.stringify(errorDetails, null, 2))
      .then(() => {
        toast({
          title: "Error details copied",
          description: "Error details have been copied to clipboard",
        })
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "Failed to copy error details",
          variant: "destructive",
        })
      })
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">Oops! Something went wrong</CardTitle>
              <CardDescription className="text-gray-600">
                We encountered an unexpected error. Don't worry, our team has been notified.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Error ID for support */}
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Error ID: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{this.state.errorId}</code>
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col space-y-2">
                <Button onClick={this.handleRetry} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>

                <Button onClick={this.handleReload} variant="outline" className="w-full bg-transparent">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reload Page
                </Button>

                <Button onClick={this.handleGoHome} variant="outline" className="w-full bg-transparent">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Homepage
                </Button>
              </div>

              {/* Error details (development only or if showDetails is true) */}
              {(process.env.NODE_ENV === "development" || this.props.showDetails) && this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                    <Bug className="inline mr-1 h-4 w-4" />
                    Error Details
                  </summary>
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <div className="text-xs font-mono text-gray-800 space-y-2">
                      <div>
                        <strong>Message:</strong>
                        <pre className="mt-1 whitespace-pre-wrap">{this.state.error.message}</pre>
                      </div>

                      {this.state.error.stack && (
                        <div>
                          <strong>Stack Trace:</strong>
                          <pre className="mt-1 whitespace-pre-wrap text-xs overflow-x-auto">
                            {this.state.error.stack}
                          </pre>
                        </div>
                      )}

                      {this.state.errorInfo?.componentStack && (
                        <div>
                          <strong>Component Stack:</strong>
                          <pre className="mt-1 whitespace-pre-wrap text-xs overflow-x-auto">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>

                    <Button onClick={this.copyErrorDetails} variant="outline" size="sm" className="mt-2 bg-transparent">
                      Copy Error Details
                    </Button>
                  </div>
                </details>
              )}

              {/* Support contact */}
              <div className="text-center text-sm text-gray-500">
                Need help? Contact our{" "}
                <a href="mailto:support@msmebazaar.com" className="text-blue-600 hover:text-blue-800 underline">
                  support team
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Higher-order component for easier usage
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, "children">,
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}

// Hook for programmatic error reporting
export const useErrorHandler = () => {
  const reportError = React.useCallback((error: Error, context?: string) => {
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Manual error report:", error, context)
    }

    // Report to error tracking service
    const errorData = {
      message: error.message,
      stack: error.stack,
      context,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userId: localStorage.getItem("userId") || "anonymous",
    }

    fetch("/api/errors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(errorData),
    }).catch(() => {
      // Silently fail if error logging fails
    })

    // Show user notification
    toast({
      title: "Error reported",
      description: "The error has been reported to our team.",
      variant: "destructive",
    })
  }, [])

  return { reportError }
}

export default ErrorBoundary
