export type UserRole = "free_user" | "pro_user" | "business_owner" | "vendor" | "buyer" | "admin" | "super_admin"

export type FeatureCategory =
  | "core"
  | "business"
  | "analytics"
  | "communication"
  | "marketplace"
  | "financial"
  | "admin"

export type AccessLevel = "none" | "limited" | "full"

export interface Feature {
  id: string
  name: string
  description: string
  category: FeatureCategory
  isProFeature: boolean
  requiredRole?: UserRole
  enabled: boolean
  beta?: boolean
  comingSoon?: boolean
  icon?: string
  order?: number
}

export interface FeatureAccess {
  featureId: string
  hasAccess: boolean
  accessLevel: AccessLevel
  reason?: "role_required" | "pro_required" | "disabled" | "beta_access" | "coming_soon"
  upgradeRequired?: boolean
  requiredRole?: UserRole
}

export interface FeatureFlag {
  id: string
  name: string
  description: string
  enabled: boolean
  rolloutPercentage?: number
  targetRoles?: UserRole[]
  targetUsers?: string[]
  environment?: "development" | "staging" | "production"
  startDate?: Date
  endDate?: Date
  metadata?: Record<string, any>
}

export interface FeatureUsage {
  featureId: string
  userId: string
  usageCount: number
  lastUsed: Date
  monthlyUsage: number
  dailyUsage: number
  limits?: {
    daily?: number
    monthly?: number
    total?: number
  }
}

export interface FeatureLimit {
  featureId: string
  role: UserRole
  isPro: boolean
  limits: {
    daily?: number
    monthly?: number
    total?: number
  }
  resetPeriod?: "daily" | "monthly" | "yearly"
}

export interface FeatureConfig {
  features: Feature[]
  featureFlags: FeatureFlag[]
  featureLimits: FeatureLimit[]
  roleHierarchy: Record<UserRole, UserRole[]>
}

export interface FeatureAccessRequest {
  userId: string
  featureId: string
  requestedAt: Date
  reason?: string
  status: "pending" | "approved" | "rejected"
  reviewedBy?: string
  reviewedAt?: Date
  reviewNotes?: string
}

export interface FeatureAnalytics {
  featureId: string
  totalUsers: number
  activeUsers: number
  usageByRole: Record<UserRole, number>
  usageByPlan: {
    free: number
    pro: number
  }
  conversionRate?: number
  retentionRate?: number
  averageUsagePerUser: number
  peakUsageTime?: string
  geographicUsage?: Record<string, number>
}

export interface FeatureNotification {
  id: string
  featureId: string
  type: "new_feature" | "feature_update" | "deprecation" | "maintenance"
  title: string
  message: string
  targetRoles?: UserRole[]
  targetUsers?: string[]
  priority: "low" | "medium" | "high" | "critical"
  scheduledAt?: Date
  expiresAt?: Date
  actionRequired?: boolean
  actionUrl?: string
  actionText?: string
}

export interface FeatureRollout {
  featureId: string
  rolloutStrategy: "immediate" | "gradual" | "targeted" | "beta"
  rolloutPercentage: number
  targetSegments?: {
    roles?: UserRole[]
    regions?: string[]
    businessTypes?: string[]
    userIds?: string[]
  }
  startDate: Date
  endDate?: Date
  rollbackConditions?: {
    errorRate?: number
    userComplaints?: number
    performanceThreshold?: number
  }
  metrics?: {
    adoptionRate: number
    errorRate: number
    userSatisfaction: number
    performanceImpact: number
  }
}

export interface FeaturePermission {
  featureId: string
  role: UserRole
  permissions: {
    read: boolean
    write: boolean
    delete: boolean
    admin: boolean
  }
  conditions?: {
    requiresPro?: boolean
    requiresVerification?: boolean
    businessTypeRestrictions?: string[]
    regionRestrictions?: string[]
  }
}

export interface FeatureBundle {
  id: string
  name: string
  description: string
  features: string[]
  price?: number
  currency?: string
  billingPeriod?: "monthly" | "yearly"
  targetRoles: UserRole[]
  popular?: boolean
  recommended?: boolean
  trialPeriod?: number
  discountPercentage?: number
}

export interface FeatureExperiment {
  id: string
  name: string
  description: string
  featureId: string
  variants: {
    id: string
    name: string
    description: string
    config: Record<string, any>
    trafficPercentage: number
  }[]
  status: "draft" | "running" | "paused" | "completed"
  startDate: Date
  endDate?: Date
  targetAudience?: {
    roles?: UserRole[]
    regions?: string[]
    userSegments?: string[]
  }
  metrics: {
    conversionRate: number
    engagementRate: number
    retentionRate: number
    revenueImpact: number
  }
  winningVariant?: string
}

// Utility types for feature management
export type FeatureAccessMap = Record<string, FeatureAccess>
export type FeatureUsageMap = Record<string, FeatureUsage>
export type RoleFeatureMatrix = Record<UserRole, string[]>

// API response types
export interface FeatureAccessResponse {
  success: boolean
  data: FeatureAccessMap
  message?: string
  timestamp: Date
}

export interface FeatureUsageResponse {
  success: boolean
  data: FeatureUsageMap
  message?: string
  timestamp: Date
}

export interface FeatureConfigResponse {
  success: boolean
  data: FeatureConfig
  version: string
  lastUpdated: Date
  message?: string
}

// Event types for feature tracking
export interface FeatureEvent {
  type: "feature_accessed" | "feature_used" | "feature_blocked" | "upgrade_prompted"
  featureId: string
  userId: string
  timestamp: Date
  metadata?: Record<string, any>
  sessionId?: string
  source?: "web" | "mobile" | "api"
}

export interface FeatureUpgradePrompt {
  featureId: string
  currentPlan: "free" | "pro"
  requiredPlan: "pro" | "enterprise"
  benefits: string[]
  ctaText: string
  ctaUrl: string
  dismissible: boolean
  showCount?: number
  maxShows?: number
}
