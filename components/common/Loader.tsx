"use client"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

// Base loader component with different variants
interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "spinner" | "dots" | "pulse" | "bars" | "ring"
  color?: "primary" | "secondary" | "accent" | "muted"
  className?: string
  text?: string
  fullScreen?: boolean
}

export function Loader({
  size = "md",
  variant = "spinner",
  color = "primary",
  className,
  text,
  fullScreen = false,
}: LoaderProps) {
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

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  }

  const renderLoader = () => {
    const baseClasses = cn(sizeClasses[size], colorClasses[color], "animate-spin", className)

    switch (variant) {
      case "spinner":
        return <Loader2 className={baseClasses} />

      case "dots":
        return (
          <div className={cn("flex space-x-1", className)}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "rounded-full bg-current",
                  size === "sm" ? "w-1 h-1" : size === "md" ? "w-2 h-2" : size === "lg" ? "w-3 h-3" : "w-4 h-4",
                  colorClasses[color],
                  "animate-bounce",
                )}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "0.6s",
                }}
              />
            ))}
          </div>
        )

      case "pulse":
        return (
          <div
            className={cn("rounded-full bg-current animate-pulse", sizeClasses[size], colorClasses[color], className)}
          />
        )

      case "bars":
        return (
          <div className={cn("flex space-x-1", className)}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "bg-current animate-pulse",
                  size === "sm" ? "w-1 h-4" : size === "md" ? "w-1 h-6" : size === "lg" ? "w-2 h-8" : "w-2 h-12",
                  colorClasses[color],
                )}
                style={{
                  animationDelay: `${i * 0.15}s`,
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
              "border-2 border-current border-t-transparent rounded-full animate-spin",
              sizeClasses[size],
              colorClasses[color],
              className,
            )}
          />
        )

      default:
        return <Loader2 className={baseClasses} />
    }
  }

  const content = (
    <div className="flex flex-col items-center justify-center space-y-2">
      {renderLoader()}
      {text && <p className={cn("text-center font-medium", textSizeClasses[size], colorClasses[color])}>{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">{content}</div>
    )
  }

  return content
}

// Specialized loader components
export function ButtonLoader({ size = "sm", className }: Pick<LoaderProps, "size" | "className">) {
  return (
    <Loader2
      className={cn("animate-spin", size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6", className)}
    />
  )
}

export function PageLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader size="lg" variant="spinner" color="primary" text={text} />
    </div>
  )
}

export function FullScreenLoader({ text = "Loading MSMEBazaar..." }: { text?: string }) {
  return <Loader size="xl" variant="spinner" color="primary" text={text} fullScreen />
}

export function InlineLoader({ size = "sm", className }: Pick<LoaderProps, "size" | "className">) {
  return (
    <Loader2
      className={cn(
        "animate-spin inline",
        size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6",
        className,
      )}
    />
  )
}

// Card loader for skeleton loading states
export function CardLoader({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="bg-gray-200 rounded-lg p-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
        </div>
        <div className="flex space-x-2">
          <div className="h-8 bg-gray-300 rounded w-20"></div>
          <div className="h-8 bg-gray-300 rounded w-16"></div>
        </div>
      </div>
    </div>
  )
}

// Table loader for data tables
export function TableLoader({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="animate-pulse">
      <div className="space-y-3">
        {/* Header */}
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-300 rounded"></div>
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// Form loader for form fields
export function FormLoader({ fields = 3 }: { fields?: number }) {
  return (
    <div className="animate-pulse space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      ))}
      <div className="h-10 bg-gray-300 rounded w-32"></div>
    </div>
  )
}

// Business-specific loaders
export function BusinessProfileLoader() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-6 bg-gray-300 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <div className="h-10 bg-gray-300 rounded w-24"></div>
        <div className="h-10 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  )
}

export function DashboardLoader() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg p-6 space-y-3">
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            <div className="h-8 bg-gray-300 rounded w-1/2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/3"></div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-200 rounded-lg p-6">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
        <div className="bg-gray-200 rounded-lg p-6">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  )
}

// Loading states with Indian business context
export function GSTPLoader() {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader size="lg" variant="spinner" color="primary" text="Verifying GST details..." />
    </div>
  )
}

export function PaymentLoader() {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader size="lg" variant="ring" color="accent" text="Processing payment..." />
    </div>
  )
}

export function LoanApplicationLoader() {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader size="lg" variant="dots" color="primary" text="Submitting loan application..." />
    </div>
  )
}

// Export default loader
export default Loader
