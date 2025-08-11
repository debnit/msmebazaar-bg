import type React from "react"
/**
 * Feature flag and service feature types for MSMEBazaar
 * Defines the structure for feature management and access control
 */

/**
 * Feature flag interface for controlling feature rollouts
 */
export interface FeatureFlag {
  id: string
  key: string
  name: string
  description?: string
  enabled: boolean
  rolloutPercentage?: number
  targetAudience?: string[]
  conditions?: Record<string, any>
  createdAt: string
  updatedAt: string
  createdBy: string
}

/**
 * Service feature interface for Pro/role-based features
 */
export interface ServiceFeature {
  id: string
  serviceId: string
  name: string
  key: string
  description?: string
  enabled: boolean
  requiresPro: boolean
  allowedRoles: string[]
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

/**
 * Feature access result interface
 */
export interface FeatureAccess {
  hasAccess: boolean
  reason?: string
  requiresUpgrade?: boolean
  missingRoles?: string[]
  featureDetails?: ServiceFeature
}

/**
 * Feature gate configuration interface
 */
export interface FeatureGateConfig {
  featureKey: string
  requiresPro?: boolean
  allowedRoles?: string[]
  customConditions?: (user: any) => boolean
  fallbackComponent?: React.ComponentType<any>
  upgradePrompt?: {
    title: string
    description: string
    ctaText: string
    ctaAction: () => void
  }
}

/**
 * Feature category enum for organizing features
 */
export enum FeatureCategory {
  CORE = "core",
  PRO = "pro",
  ADMIN = "admin",
  EXPERIMENTAL = "experimental",
  DEPRECATED = "deprecated",
}

/**
 * Feature status enum
 */
export enum FeatureStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BETA = "beta",
  DEPRECATED = "deprecated",
  COMING_SOON = "coming_soon",
}

/**
 * Feature environment enum
 */
export enum FeatureEnvironment {
  DEVELOPMENT = "development",
  STAGING = "staging",
  PRODUCTION = "production",
}

/**
 * Extended feature flag with additional metadata
 */
export interface ExtendedFeatureFlag extends FeatureFlag {
  category: FeatureCategory
  status: FeatureStatus
  environment: FeatureEnvironment[]
  dependencies?: string[]
  tags?: string[]
  analytics?: {
    usageCount: number
    lastUsed?: string
    conversionRate?: number
  }
}

/**
 * Feature usage analytics interface
 */
export interface FeatureUsageAnalytics {
  featureKey: string
  userId: string
  timestamp: string
  action: "viewed" | "used" | "upgraded" | "blocked"
  metadata?: Record<string, any>
}

/**
 * Feature rollout strategy interface
 */
export interface FeatureRolloutStrategy {
  type: "percentage" | "user_list" | "role_based" | "geographic" | "custom"
  config: {
    percentage?: number
    userIds?: string[]
    roles?: string[]
    countries?: string[]
    customRule?: string
  }
}

/**
 * Feature experiment interface for A/B testing
 */
export interface FeatureExperiment {
  id: string
  name: string
  description: string
  featureKey: string
  variants: {
    name: string
    weight: number
    config: Record<string, any>
  }[]
  startDate: string
  endDate?: string
  status: "draft" | "running" | "completed" | "paused"
  metrics: {
    conversionGoal: string
    successMetric: string
  }
}

/**
 * User feature preferences interface
 */
export interface UserFeaturePreferences {
  userId: string
  preferences: {
    featureKey: string
    enabled: boolean
    customConfig?: Record<string, any>
  }[]
  updatedAt: string
}

/**
 * Feature notification interface
 */
export interface FeatureNotification {
  id: string
  featureKey: string
  type: "new_feature" | "feature_update" | "deprecation" | "upgrade_required"
  title: string
  message: string
  actionUrl?: string
  actionText?: string
  targetRoles?: string[]
  targetUsers?: string[]
  expiresAt?: string
  createdAt: string
}

/**
 * Feature audit log interface
 */
export interface FeatureAuditLog {
  id: string
  featureKey: string
  action: "created" | "updated" | "enabled" | "disabled" | "deleted"
  userId: string
  userRole: string
  changes?: Record<string, { from: any; to: any }>
  reason?: string
  timestamp: string
  ipAddress?: string
  userAgent?: string
}

/**
 * Feature dependency interface
 */
export interface FeatureDependency {
  featureKey: string
  dependsOn: string[]
  conflictsWith?: string[]
  requiredVersion?: string
}

/**
 * Feature configuration schema interface
 */
export interface FeatureConfigSchema {
  featureKey: string
  schema: {
    type: "object" | "array" | "string" | "number" | "boolean"
    properties?: Record<string, any>
    required?: string[]
    default?: any
  }
  validation?: {
    rules: string[]
    customValidator?: string
  }
}

/**
 * Feature toggle response interface
 */
export interface FeatureToggleResponse {
  success: boolean
  featureKey: string
  enabled: boolean
  config?: Record<string, any>
  message?: string
  error?: string
}

/**
 * Bulk feature operation interface
 */
export interface BulkFeatureOperation {
  operation: "enable" | "disable" | "update" | "delete"
  featureKeys: string[]
  config?: Record<string, any>
  reason?: string
}

/**
 * Feature health check interface
 */
export interface FeatureHealthCheck {
  featureKey: string
  status: "healthy" | "degraded" | "unhealthy"
  lastChecked: string
  metrics: {
    errorRate: number
    responseTime: number
    usageCount: number
  }
  issues?: string[]
}

export default FeatureFlag
