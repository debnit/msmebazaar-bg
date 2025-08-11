"use client"

import type React from "react"
import { useAuth } from "@/hooks/use-auth"
import { usePro } from "@/hooks/use-pro"
import { Feature, type UserRole, AccessLevel } from "@/types/feature"
import { hasFeatureAccess, getFeatureAccessReason } from "@/utils/feature-gate"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lock, Crown, Zap, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeatureGateProps {
  feature: Feature
  children: React.ReactNode
  fallback?: React.ReactNode
  showUpgrade?: boolean
  className?: string
  requiredRole?: UserRole
  requiredAccessLevel?: AccessLevel
}

interface UpgradePromptProps {
  feature: Feature
  requiredRole?: UserRole
  onUpgrade?: () => void
  className?: string
}

interface FeatureLockedProps {
  feature: Feature
  reason: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function FeatureGate({
  feature,
  children,
  fallback,
  showUpgrade = true,
  className,
  requiredRole,
  requiredAccessLevel = AccessLevel.READ,
}: FeatureGateProps) {
  const { user } = useAuth()
  const { isProUser, upgradeToPro } = usePro()

  // Check if user has access to the feature
  const hasAccess = hasFeatureAccess(user, feature, requiredAccessLevel, requiredRole)

  if (hasAccess) {
    return <div className={className}>{children}</div>
  }

  // If fallback is provided, use it
  if (fallback) {
    return <div className={className}>{fallback}</div>
  }

  // Get the reason for access denial
  const accessReason = getFeatureAccessReason(user, feature, requiredAccessLevel, requiredRole)

  // Show upgrade prompt if user needs Pro subscription
  if (showUpgrade && accessReason.includes("Pro subscription")) {
    return (
      <UpgradePrompt feature={feature} requiredRole={requiredRole} onUpgrade={upgradeToPro} className={className} />
    )
  }

  // Show feature locked message
  return <FeatureLocked feature={feature} reason={accessReason} className={className} />
}

export function UpgradePrompt({ feature, requiredRole, onUpgrade, className }: UpgradePromptProps) {
  const { user } = useAuth()
  const { proPlans, isLoading } = usePro()

  const getFeatureIcon = (feature: Feature) => {
    switch (feature) {
      case Feature.ADVANCED_ANALYTICS:
      case Feature.CUSTOM_REPORTS:
        return <Zap className="h-5 w-5" />
      case Feature.PRIORITY_SUPPORT:
      case Feature.DEDICATED_MANAGER:
        return <Crown className="h-5 w-5" />
      default:
        return <Lock className="h-5 w-5" />
    }
  }

  const getFeatureTitle = (feature: Feature) => {
    return feature.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const getFeatureDescription = (feature: Feature) => {
    const descriptions = {
      [Feature.ADVANCED_ANALYTICS]:
        "Get detailed insights into your business performance with advanced analytics and custom dashboards.",
      [Feature.CUSTOM_REPORTS]: "Create and schedule custom reports tailored to your business needs.",
      [Feature.PRIORITY_SUPPORT]: "Get priority customer support with faster response times.",
      [Feature.BULK_OPERATIONS]: "Perform bulk operations on products, orders, and customers.",
      [Feature.API_ACCESS]: "Access our REST API to integrate with your existing systems.",
      [Feature.WHITE_LABEL]: "Customize the platform with your own branding and domain.",
      [Feature.DEDICATED_MANAGER]: "Get a dedicated account manager for personalized support.",
      [Feature.CUSTOM_INTEGRATIONS]: "Build custom integrations with third-party services.",
      [Feature.ADVANCED_SECURITY]: "Enhanced security features including SSO and audit logs.",
      [Feature.UNLIMITED_USERS]: "Add unlimited team members to your account.",
    }
    return descriptions[feature] || "Unlock this premium feature with a Pro subscription."
  }

  return (
    <Card className={cn("border-2 border-dashed border-orange-200 bg-orange-50/50", className)}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
          {getFeatureIcon(feature)}
        </div>
        <CardTitle className="text-lg">{getFeatureTitle(feature)}</CardTitle>
        <CardDescription className="text-sm">{getFeatureDescription(feature)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            <Crown className="mr-1 h-3 w-3" />
            Pro Feature
          </Badge>
          {requiredRole && <Badge variant="outline">{requiredRole.replace(/_/g, " ")}</Badge>}
        </div>

        <div className="space-y-2">
          <Button onClick={onUpgrade} className="w-full bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
            {isLoading ? "Loading..." : "Upgrade to Pro"}
          </Button>
          <p className="text-xs text-center text-muted-foreground">Starting from ₹999/month • Cancel anytime</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function FeatureLocked({ feature, reason, action, className }: FeatureLockedProps) {
  const getFeatureTitle = (feature: Feature) => {
    return feature.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <Card className={cn("border-2 border-dashed border-gray-200 bg-gray-50/50", className)}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <Lock className="h-5 w-5 text-gray-500" />
        </div>
        <CardTitle className="text-lg text-gray-700">{getFeatureTitle(feature)}</CardTitle>
        <CardDescription className="text-sm">{reason}</CardDescription>
      </CardHeader>
      {action && (
        <CardContent>
          <Button onClick={action.onClick} variant="outline" className="w-full bg-transparent">
            {action.label}
          </Button>
        </CardContent>
      )}
    </Card>
  )
}

// Higher-order component for feature gating
export function withFeatureGate<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  feature: Feature,
  options?: {
    requiredRole?: UserRole
    requiredAccessLevel?: AccessLevel
    fallback?: React.ComponentType
    showUpgrade?: boolean
  },
) {
  const FeatureGatedComponent = (props: P) => {
    return (
      <FeatureGate
        feature={feature}
        requiredRole={options?.requiredRole}
        requiredAccessLevel={options?.requiredAccessLevel}
        showUpgrade={options?.showUpgrade}
        fallback={options?.fallback ? <options.fallback /> : undefined}
      >
        <WrappedComponent {...props} />
      </FeatureGate>
    )
  }

  FeatureGatedComponent.displayName = `withFeatureGate(${WrappedComponent.displayName || WrappedComponent.name})`

  return FeatureGatedComponent
}

// Hook for conditional rendering based on feature access
export function useFeatureGate(
  feature: Feature,
  requiredAccessLevel: AccessLevel = AccessLevel.READ,
  requiredRole?: UserRole,
) {
  const { user } = useAuth()

  const hasAccess = hasFeatureAccess(user, feature, requiredAccessLevel, requiredRole)
  const reason = hasAccess ? null : getFeatureAccessReason(user, feature, requiredAccessLevel, requiredRole)

  return {
    hasAccess,
    reason,
    FeatureGate: ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) => (
      <FeatureGate
        feature={feature}
        requiredAccessLevel={requiredAccessLevel}
        requiredRole={requiredRole}
        fallback={fallback}
      >
        {children}
      </FeatureGate>
    ),
  }
}

// Utility component for feature status indicators
export function FeatureStatus({
  feature,
  className,
}: {
  feature: Feature
  className?: string
}) {
  const { user } = useAuth()
  const { isProUser } = usePro()

  const hasAccess = hasFeatureAccess(user, feature)

  if (hasAccess) {
    return (
      <Badge variant="default" className={cn("bg-green-100 text-green-800", className)}>
        <Info className="mr-1 h-3 w-3" />
        Available
      </Badge>
    )
  }

  if (!isProUser) {
    return (
      <Badge variant="secondary" className={cn("bg-orange-100 text-orange-800", className)}>
        <Crown className="mr-1 h-3 w-3" />
        Pro Only
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className={cn("bg-gray-100 text-gray-600", className)}>
      <AlertTriangle className="mr-1 h-3 w-3" />
      Restricted
    </Badge>
  )
}

export default FeatureGate
