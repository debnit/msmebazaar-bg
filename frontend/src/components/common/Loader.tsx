"use client"

import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "spinner" | "dots" | "pulse" | "bars" | "ring"
  color?: "primary" | "secondary" | "accent" | "muted"
  text?: string
  fullScreen?: boolean
  className?: string
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
}

const colorClasses = {
  primary: "text-blue-600",
  secondary: "text-gray-600",
  accent: "text-green-600",
  muted: "text-gray-400",
}

export function Loader({
  size = "md",
  variant = "spinner",
  color = "primary",
  text,
  fullScreen = false,
  className,
}: LoaderProps) {
  const renderLoader = () => {
    switch (variant) {
      case "spinner":
        return <Loader2 className={cn("animate-spin", sizeClasses[size], colorClasses[color], className)} />

      case "dots":
        return (
          <div className={cn("flex space-x-1", className)}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "rounded-full animate-pulse",
                  size === "sm" && "w-1 h-1",
                  size === "md" && "w-2 h-2",
                  size === "lg" && "w-3 h-3",
                  size === "xl" && "w-4 h-4",
                  colorClasses[color].replace("text-", "bg-"),
                )}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1.4s",
                }}
              />
            ))}
          </div>
        )

      case "pulse":
        return (
          <div
            className={cn(
              "rounded-full animate-pulse",
              sizeClasses[size],
              colorClasses[color].replace("text-", "bg-"),
              className,
            )}
          />
        )

      case "bars":
        return (
          <div className={cn("flex space-x-1", className)}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "animate-pulse",
                  size === "sm" && "w-1 h-4",
                  size === "md" && "w-1 h-6",
                  size === "lg" && "w-2 h-8",
                  size === "xl" && "w-2 h-12",
                  colorClasses[color].replace("text-", "bg-"),
                )}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "1.2s",
                }}
              />
            ))}
          </div>
        )

      case "ring":
        return (
          <div
            className={cn(
              "animate-spin rounded-full border-2 border-transparent",
              sizeClasses[size],
              colorClasses[color].replace("text-", "border-t-"),
              className,
            )}
          />
        )

      default:
        return <Loader2 className={cn("animate-spin", sizeClasses[size], colorClasses[color], className)} />
    }
  }

  const content = (
    <div className="flex flex-col items-center justify-center space-y-2">
      {renderLoader()}
      {text && <p className={cn("text-sm", colorClasses[color])}>{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">{content}</div>
    )
  }

  return content
}

// Button Loader Component
export interface ButtonLoaderProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function ButtonLoader({ size = "sm", className }: ButtonLoaderProps) {
  return (
    <Loader2
      className={cn(
        "animate-spin",
        size === "sm" && "w-4 h-4",
        size === "md" && "w-5 h-5",
        size === "lg" && "w-6 h-6",
        className,
      )}
    />
  )
}

// Page Loader Component
export interface PageLoaderProps {
  text?: string
  className?: string
}

export function PageLoader({ text = "Loading...", className }: PageLoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[400px] space-y-4", className)}>
      <Loader size="lg" variant="spinner" color="primary" />
      <div className="text-center">
        <p className="text-lg font-medium text-gray-900">{text}</p>
        <p className="text-sm text-gray-500 mt-1">Please wait while we load your content</p>
      </div>
    </div>
  )
}

// Full Screen Loader
export interface FullScreenLoaderProps {
  text?: string
  subText?: string
}

export function FullScreenLoader({ text = "Loading MSMEBazaar", subText }: FullScreenLoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded animate-pulse" />
          <span className="text-2xl font-bold text-gray-900">MSMEBazaar</span>
        </div>
        <Loader size="lg" variant="spinner" color="primary" />
        <div>
          <p className="text-lg font-medium text-gray-900">{text}</p>
          {subText && <p className="text-sm text-gray-500 mt-1">{subText}</p>}
        </div>
      </div>
    </div>
  )
}

// Inline Loader
export interface InlineLoaderProps {
  text?: string
  size?: "sm" | "md"
  className?: string
}

export function InlineLoader({ text = "Loading", size = "sm", className }: InlineLoaderProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Loader size={size} variant="spinner" color="muted" />
      <span className={cn("text-gray-600", size === "sm" ? "text-sm" : "text-base")}>{text}</span>
    </div>
  )
}

// Skeleton Loaders
export function CardLoader({ className }: { className?: string }) {
  return (
    <div className={cn("border rounded-lg p-6 space-y-4", className)}>
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-4/6" />
      </div>
    </div>
  )
}

export function TableLoader({
  rows = 5,
  columns = 4,
  className,
}: { rows?: number; columns?: number; className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded animate-pulse flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="h-3 bg-gray-100 rounded animate-pulse flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function FormLoader({ fields = 4, className }: { fields?: number; className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
          <div className="h-10 bg-gray-100 rounded animate-pulse" />
        </div>
      ))}
      <div className="h-10 bg-blue-200 rounded animate-pulse w-32" />
    </div>
  )
}

// Business-specific loaders
export function BusinessProfileLoader({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse" />
        <div className="space-y-2 flex-1">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
        </div>
        <div className="h-8 bg-blue-200 rounded animate-pulse w-24" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-100 rounded animate-pulse" />
          <div className="h-3 bg-gray-100 rounded animate-pulse w-5/6" />
          <div className="h-3 bg-gray-100 rounded animate-pulse w-4/6" />
        </div>
      </div>
    </div>
  )
}

export function DashboardLoader({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-64" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-48" />
        </div>
        <div className="h-10 bg-blue-200 rounded animate-pulse w-32" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6 space-y-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
          <div className="h-64 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="border rounded-lg p-6 space-y-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
          <div className="h-64 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}

// Specialized business loaders
export function GSTLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <Loader size="sm" variant="spinner" color="primary" />
      <span className="text-sm text-gray-600">Verifying GST number...</span>
    </div>
  )
}

export function PaymentLoader({ className }: { className?: string }) {
  return (
    <div className={cn("text-center space-y-4", className)}>
      <Loader size="lg" variant="ring" color="primary" />
      <div>
        <p className="text-lg font-medium text-gray-900">Processing Payment</p>
        <p className="text-sm text-gray-500">Please do not close this window</p>
      </div>
    </div>
  )
}

export function LoanApplicationLoader({ className }: { className?: string }) {
  return (
    <div className={cn("text-center space-y-4", className)}>
      <Loader size="lg" variant="dots" color="accent" />
      <div>
        <p className="text-lg font-medium text-gray-900">Submitting Application</p>
        <p className="text-sm text-gray-500">Analyzing your business profile...</p>
      </div>
    </div>
  )
}

// Export default
export default Loader