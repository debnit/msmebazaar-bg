// Feature and access control types for MSMEBazaar

export enum UserRole {
  FREE_USER = "free_user",
  PRO_USER = "pro_user",
  BUSINESS_OWNER = "business_owner",
  VENDOR = "vendor",
  BUYER = "buyer",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

export enum FeatureType {
  CORE = "core",
  PRO = "pro",
  BUSINESS = "business",
  ANALYTICS = "analytics",
  INTEGRATION = "integration",
  EXPERIMENTAL = "experimental",
}

export enum AccessLevel {
  NONE = "none",
  READ = "read",
  WRITE = "write",
  ADMIN = "admin",
  FULL = "full",
}

export enum FeatureStatus {
  ENABLED = "enabled",
  DISABLED = "disabled",
  BETA = "beta",
  DEPRECATED = "deprecated",
  COMING_SOON = "coming_soon",
}

// Core feature definitions
export interface Feature {
  id: string
  name: string
  description: string
  type: FeatureType
  status: FeatureStatus
  requiredRole: UserRole[]
  requiredPlan?: string[]
  dependencies?: string[]
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

// Feature access configuration
export interface FeatureAccess {
  featureId: string
  userId?: string
  roleId?: UserRole
  accessLevel: AccessLevel
  conditions?: FeatureCondition[]
  expiresAt?: Date
  grantedAt: Date
  grantedBy: string
}

// Feature conditions for dynamic access
export interface FeatureCondition {
  type: "subscription" | "usage_limit" | "time_based" | "location" | "custom"
  operator: "equals" | "not_equals" | "greater_than" | "less_than" | "in" | "not_in"
  value: any
  metadata?: Record<string, any>
}

// Feature flags for A/B testing and gradual rollouts
export interface FeatureFlag {
  id: string
  name: string
  description: string
  enabled: boolean
  rolloutPercentage: number
  targetRoles?: UserRole[]
  targetUsers?: string[]
  conditions?: FeatureFlagCondition[]
  variants?: FeatureFlagVariant[]
  createdAt: Date
  updatedAt: Date
}

export interface FeatureFlagCondition {
  attribute: string
  operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than"
  value: any
}

export interface FeatureFlagVariant {
  id: string
  name: string
  weight: number
  payload?: Record<string, any>
}

// Feature usage tracking
export interface FeatureUsage {
  userId: string
  featureId: string
  usageCount: number
  lastUsedAt: Date
  metadata?: Record<string, any>
}

// Feature limits for different plans
export interface FeatureLimit {
  featureId: string
  planType: string
  limitType: "count" | "size" | "duration" | "bandwidth"
  limitValue: number
  resetPeriod?: "daily" | "weekly" | "monthly" | "yearly"
  metadata?: Record<string, any>
}

// Feature analytics
export interface FeatureAnalytics {
  featureId: string
  totalUsers: number
  activeUsers: number
  usageCount: number
  conversionRate?: number
  retentionRate?: number
  period: {
    start: Date
    end: Date
  }
  breakdown: {
    byRole: Record<UserRole, number>
    byPlan: Record<string, number>
    byRegion?: Record<string, number>
  }
}

// Feature experiment for A/B testing
export interface FeatureExperiment {
  id: string
  name: string
  description: string
  featureId: string
  status: "draft" | "running" | "paused" | "completed"
  variants: ExperimentVariant[]
  targetAudience: {
    roles?: UserRole[]
    percentage: number
    conditions?: FeatureCondition[]
  }
  metrics: ExperimentMetric[]
  startDate: Date
  endDate?: Date
  results?: ExperimentResult[]
}

export interface ExperimentVariant {
  id: string
  name: string
  description: string
  trafficAllocation: number
  configuration: Record<string, any>
}

export interface ExperimentMetric {
  name: string
  type: "conversion" | "engagement" | "retention" | "revenue"
  goal: "increase" | "decrease"
  targetValue?: number
}

export interface ExperimentResult {
  variantId: string
  metrics: Record<
    string,
    {
      value: number
      confidence: number
      significance: number
    }
  >
  sampleSize: number
}

// Feature request and feedback
export interface FeatureRequest {
  id: string
  title: string
  description: string
  requestedBy: string
  priority: "low" | "medium" | "high" | "critical"
  status: "submitted" | "under_review" | "approved" | "in_development" | "completed" | "rejected"
  votes: number
  category: string
  estimatedEffort?: number
  businessValue?: number
  createdAt: Date
  updatedAt: Date
}

export interface FeatureFeedback {
  id: string
  featureId: string
  userId: string
  rating: number
  comment?: string
  category: "bug" | "improvement" | "praise" | "question"
  status: "new" | "acknowledged" | "resolved"
  createdAt: Date
}

// Feature gate configuration
export interface FeatureGateConfig {
  features: Record<string, Feature>
  rolePermissions: Record<UserRole, string[]>
  planFeatures: Record<string, string[]>
  featureFlags: Record<string, FeatureFlag>
  limits: Record<string, FeatureLimit[]>
}

// Feature check result
export interface FeatureCheckResult {
  hasAccess: boolean
  accessLevel: AccessLevel
  reason?: string
  limitations?: {
    usageCount?: number
    usageLimit?: number
    expiresAt?: Date
  }
  metadata?: Record<string, any>
}

// Feature context for components
export interface FeatureContext {
  userId: string
  userRole: UserRole
  userPlan?: string
  features: Record<string, FeatureCheckResult>
  flags: Record<string, boolean | any>
  experiments: Record<string, string> // experiment -> variant mapping
}

// Pro feature specific types
export interface ProFeature {
  id: string
  name: string
  description: string
  category: "analytics" | "automation" | "integration" | "support" | "storage"
  tier: "basic" | "premium" | "enterprise"
  monthlyLimit?: number
  features: string[]
  price: {
    monthly: number
    yearly: number
    currency: string
  }
}

// Business feature types for MSME
export interface BusinessFeature {
  id: string
  name: string
  description: string
  category: "inventory" | "accounting" | "crm" | "marketing" | "compliance"
  industrySpecific?: string[]
  businessSize: "micro" | "small" | "medium" | "all"
  regulatoryCompliance?: string[]
  integrations?: string[]
}

// Feature notification
export interface FeatureNotification {
  id: string
  type: "new_feature" | "feature_update" | "limit_reached" | "upgrade_prompt"
  title: string
  message: string
  featureId?: string
  userId: string
  read: boolean
  actionUrl?: string
  createdAt: Date
}

// Export utility types
export type FeatureId = string
export type FeatureName = string
export type FeatureMap = Record<FeatureId, Feature>
export type FeatureAccessMap = Record<FeatureId, FeatureCheckResult>
export type FeatureFlagMap = Record<string, boolean | any>

// Feature gate hook return type
export interface UseFeatureGateReturn {
  hasFeature: (featureId: string) => boolean
  getFeatureAccess: (featureId: string) => FeatureCheckResult
  canUseFeature: (featureId: string, action?: string) => boolean
  getFeatureLimit: (featureId: string) => FeatureLimit | null
  getRemainingUsage: (featureId: string) => number | null
  isFeatureFlagEnabled: (flagId: string) => boolean
  getFeatureFlagVariant: (flagId: string) => any
  trackFeatureUsage: (featureId: string, metadata?: Record<string, any>) => void
}

// Feature admin types
export interface FeatureAdminConfig {
  canManageFeatures: boolean
  canManageFlags: boolean
  canViewAnalytics: boolean
  canManageExperiments: boolean
  canManageRequests: boolean
}

export interface FeatureAdminAction {
  type: "enable" | "disable" | "update" | "delete" | "create"
  featureId: string
  userId: string
  timestamp: Date
  changes?: Record<string, any>
  reason?: string
}
