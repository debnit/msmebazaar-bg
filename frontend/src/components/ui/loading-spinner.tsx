import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const spinnerVariants = cva("animate-spin rounded-full border-2 border-solid border-current border-r-transparent", {
  variants: {
    size: {
      sm: "h-4 w-4",
      default: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-12 w-12",
    },
    variant: {
      default: "text-primary",
      secondary: "text-secondary",
      muted: "text-muted-foreground",
      white: "text-white",
      destructive: "text-destructive",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
})

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  /**
   * Show loading text alongside spinner
   */
  showText?: boolean
  /**
   * Custom loading text
   */
  text?: string
  /**
   * Center the spinner in its container
   */
  centered?: boolean
}

/**
 * Loading spinner component with multiple sizes and variants
 * Provides visual feedback during async operations
 */
const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size, variant, showText = false, text = "Loading...", centered = false, ...props }, ref) => {
    const spinnerElement = (
      <div
        ref={ref}
        className={cn(spinnerVariants({ size, variant }), className)}
        role="status"
        aria-label={text}
        {...props}
      >
        <span className="sr-only">{text}</span>
      </div>
    )

    if (showText) {
      return (
        <div className={cn("flex items-center gap-2", centered && "justify-center", className)}>
          {spinnerElement}
          <span className="text-sm text-muted-foreground">{text}</span>
        </div>
      )
    }

    if (centered) {
      return <div className={cn("flex justify-center items-center", className)}>{spinnerElement}</div>
    }

    return spinnerElement
  },
)

LoadingSpinner.displayName = "LoadingSpinner"

/**
 * Full page loading overlay component
 */
export interface PageLoadingProps {
  /**
   * Loading message to display
   */
  message?: string
  /**
   * Show backdrop overlay
   */
  overlay?: boolean
}

export const PageLoading: React.FC<PageLoadingProps> = ({ message = "Loading...", overlay = true }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        overlay && "bg-background/80 backdrop-blur-sm",
      )}
      role="status"
      aria-label={message}
    >
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="xl" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}

/**
 * Inline loading component for buttons and small areas
 */
export interface InlineLoadingProps {
  /**
   * Size of the spinner
   */
  size?: "sm" | "default"
  /**
   * Loading text
   */
  text?: string
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({ size = "sm", text = "Loading..." }) => {
  return (
    <div className="flex items-center gap-2">
      <LoadingSpinner size={size} />
      <span className="text-sm">{text}</span>
    </div>
  )
}

/**
 * Card loading skeleton component
 */
export const CardLoading: React.FC = () => {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="space-y-4">
        <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
        <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
        <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
      </div>
    </div>
  )
}

/**
 * Table loading skeleton component
 */
export const TableLoading: React.FC<{ rows?: number; columns?: number }> = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-muted animate-pulse rounded flex-1" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="h-4 bg-muted/50 animate-pulse rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

/**
 * Button loading state component
 */
export interface ButtonLoadingProps {
  /**
   * Loading text to show
   */
  text?: string
  /**
   * Size of spinner
   */
  size?: "sm" | "default"
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({ text = "Loading...", size = "sm" }) => {
  return (
    <div className="flex items-center gap-2">
      <LoadingSpinner size={size} variant="white" />
      <span>{text}</span>
    </div>
  )
}

export { LoadingSpinner, spinnerVariants }
