import type React from "react"
import type { User } from "@/types/user"
import type { FeatureFlag } from "@/types/feature"

/**
 * Available user roles in the MSMEBazaar platform
 */
export const USER_ROLES = {
  MSME_OWNER: "msmeOwner",
  BUYER: "buyer",
  SELLER: "seller",
  INVESTOR: "investor",
  AGENT: "agent",
  FOUNDER: "founder",
  ADMIN: "admin",
  SUPER_ADMIN: "superAdmin",
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

/**
 * Available features in the MSMEBazaar platform
 */
export const FEATURES = {
  // Core features
  BUSINESS_LOANS: "business-loans",
  BUSINESS_VALUATION: "business-valuation",
  EXIT_STRATEGY: "exit-strategy",
  MARKET_LINKAGE: "market-linkage",
  MSME_NETWORKING: "msme-networking",
  COMPLIANCE: "compliance",
  PLANT_MACHINERY: "plant-machinery-installation",
  LEADERSHIP_TRAINING: "leadership-training",

  // Pro features
  ADVANCED_ANALYTICS: "advanced-analytics",
  PRIORITY_SUPPORT: "priority-support",
  CUSTOM_REPORTS: "custom-reports",
  API_ACCESS: "api-access",
  WHITE_LABEL: "white-label",

  // Role-specific features
  AGENT_DASHBOARD: "agent-dashboard",
  INVESTOR_PORTAL: "investor-portal",
  ADMIN_PANEL: "admin-panel",
  SUPER_ADMIN_PANEL: "super-admin-panel",
} as const

export type Feature = (typeof FEATURES)[keyof typeof FEATURES]

/**
 * Feature access levels
 */
export const ACCESS_LEVELS = {
  FREE: "free",
  PRO: "pro",
  ROLE_BASED: "role-based",
  ADMIN: "admin",
} as const

export type AccessLevel = (typeof ACCESS_LEVELS)[keyof typeof ACCESS_LEVELS]

/**
 * Feature configuration mapping features to their access requirements
 */
export const FEATURE_CONFIG: Record<
  Feature,
  {
    accessLevel: AccessLevel
    requiredRoles?: UserRole[]
    requiresPro?: boolean
    description: string
  }
> = {
  // Core features - available to all authenticated users
  [FEATURES.BUSINESS_LOANS]: {
    accessLevel: ACCESS_LEVELS.FREE,
    description: "Apply for business loans with basic features",
  },
  [FEATURES.BUSINESS_VALUATION]: {
    accessLevel: ACCESS_LEVELS.FREE,
    description: "Basic business valuation tools",
  },
  [FEATURES.EXIT_STRATEGY]: {
    accessLevel: ACCESS_LEVELS.PRO,
    requiresPro: true,
    description: "Exit strategy planning and Navarambh applications",
  },
  [FEATURES.MARKET_LINKAGE]: {
    accessLevel: ACCESS_LEVELS.FREE,
    description: "Connect with buyers and suppliers",
  },
  [FEATURES.MSME_NETWORKING]: {
    accessLevel: ACCESS_LEVELS.FREE,
    description: "Network with other MSME owners",
  },
  [FEATURES.COMPLIANCE]: {
    accessLevel: ACCESS_LEVELS.PRO,
    requiresPro: true,
    description: "Compliance management and guidance",
  },
  [FEATURES.PLANT_MACHINERY]: {
    accessLevel: ACCESS_LEVELS.PRO,
    requiresPro: true,
    description: "Plant and machinery installation services",
  },
  [FEATURES.LEADERSHIP_TRAINING]: {
    accessLevel: ACCESS_LEVELS.PRO,
    requiresPro: true,
    description: "Leadership development programs",
  },

  // Pro features
  [FEATURES.ADVANCED_ANALYTICS]: {
    accessLevel: ACCESS_LEVELS.PRO,
    requiresPro: true,
    description: "Advanced business analytics and insights",
  },
  [FEATURES.PRIORITY_SUPPORT]: {
    accessLevel: ACCESS_LEVELS.PRO,
    requiresPro: true,
    description: "Priority customer support",
  },
  [FEATURES.CUSTOM_REPORTS]: {
    accessLevel: ACCESS_LEVELS.PRO,
    requiresPro: true,
    description: "Generate custom business reports",
  },
  [FEATURES.API_ACCESS]: {
    accessLevel: ACCESS_LEVELS.PRO,
    requiresPro: true,
    description: "API access for integrations",
  },
  [FEATURES.WHITE_LABEL]: {
    accessLevel: ACCESS_LEVELS.PRO,
    requiresPro: true,
    description: "White-label solutions",
  },

  // Role-specific features
  [FEATURES.AGENT_DASHBOARD]: {
    accessLevel: ACCESS_LEVELS.ROLE_BASED,
    requiredRoles: [USER_ROLES.AGENT],
    description: "Agent dashboard for managing referrals",
  },
  [FEATURES.INVESTOR_PORTAL]: {
    accessLevel: ACCESS_LEVELS.ROLE_BASED,
    requiredRoles: [USER_ROLES.INVESTOR],
    description: "Investor portal for deal flow",
  },
  [FEATURES.ADMIN_PANEL]: {
    accessLevel: ACCESS_LEVELS.ADMIN,
    requiredRoles: [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
    description: "Administrative panel",
  },
  [FEATURES.SUPER_ADMIN_PANEL]: {
    accessLevel: ACCESS_LEVELS.ADMIN,
    requiredRoles: [USER_ROLES.SUPER_ADMIN],
    description: "Super admin panel with full system access",
  },
}

/**
 * Check if user has access to a specific feature
 */
export function hasFeatureAccess(
  user: User | null,
  feature: Feature,
  featureFlags?: FeatureFlag[],
): {
  hasAccess: boolean
  reason?: string
  upgradeRequired?: boolean
} {
  // User must be authenticated
  if (!user) {
    return {
      hasAccess: false,
      reason: "Authentication required",
    }
  }

  const config = FEATURE_CONFIG[feature]
  if (!config) {
    return {
      hasAccess: false,
      reason: "Feature not found",
    }
  }

  // Check feature flags first
  if (featureFlags) {
    const featureFlag = featureFlags.find((flag) => flag.key === feature)
    if (featureFlag && !featureFlag.enabled) {
      return {
        hasAccess: false,
        reason: "Feature is currently disabled",
      }
    }
  }

  // Check access level requirements
  switch (config.accessLevel) {
    case ACCESS_LEVELS.FREE:
      // Free features are available to all authenticated users
      return { hasAccess: true }

    case ACCESS_LEVELS.PRO:
      if (!user.isPro) {
        return {
          hasAccess: false,
          reason: "Pro subscription required",
          upgradeRequired: true,
        }
      }
      return { hasAccess: true }

    case ACCESS_LEVELS.ROLE_BASED:
      if (!config.requiredRoles) {
        return { hasAccess: true }
      }

      const hasRequiredRole = config.requiredRoles.some((role) => user.roles?.includes(role))
      if (!hasRequiredRole) {
        return {
          hasAccess: false,
          reason: `Required role: ${config.requiredRoles.join(" or ")}`,
        }
      }

      // Check Pro requirement for role-based features
      if (config.requiresPro && !user.isPro) {
        return {
          hasAccess: false,
          reason: "Pro subscription required for this role feature",
          upgradeRequired: true,
        }
      }

      return { hasAccess: true }

    case ACCESS_LEVELS.ADMIN:
      if (!config.requiredRoles) {
        return {
          hasAccess: false,
          reason: "Admin access required",
        }
      }

      const hasAdminRole = config.requiredRoles.some((role) => user.roles?.includes(role))
      if (!hasAdminRole) {
        return {
          hasAccess: false,
          reason: "Admin privileges required",
        }
      }

      return { hasAccess: true }

    default:
      return {
        hasAccess: false,
        reason: "Unknown access level",
      }
  }
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: User | null, roles: UserRole[]): boolean {
  if (!user || !user.roles) return false
  return roles.some((role) => user.roles.includes(role))
}

/**
 * Check if user has all of the specified roles
 */
export function hasAllRoles(user: User | null, roles: UserRole[]): boolean {
  if (!user || !user.roles) return false
  return roles.every((role) => user.roles.includes(role))
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null, role: UserRole): boolean {
  if (!user || !user.roles) return false
  return user.roles.includes(role)
}

/**
 * Check if user is Pro subscriber
 */
export function isProUser(user: User | null): boolean {
  return user?.isPro === true
}

/**
 * Check if user is admin (admin or super admin)
 */
export function isAdmin(user: User | null): boolean {
  return hasAnyRole(user, [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN])
}

/**
 * Check if user is super admin
 */
export function isSuperAdmin(user: User | null): boolean {
  return hasRole(user, USER_ROLES.SUPER_ADMIN)
}

/**
 * Get all features accessible to a user
 */
export function getAccessibleFeatures(user: User | null, featureFlags?: FeatureFlag[]): Feature[] {
  if (!user) return []

  return Object.keys(FEATURES).filter((feature) => {
    const { hasAccess } = hasFeatureAccess(user, feature as Feature, featureFlags)
    return hasAccess
  }) as Feature[]
}

/**
 * Get features that require Pro upgrade
 */
export function getProFeatures(): Feature[] {
  return Object.entries(FEATURE_CONFIG)
    .filter(([, config]) => config.requiresPro || config.accessLevel === ACCESS_LEVELS.PRO)
    .map(([feature]) => feature as Feature)
}

/**
 * Get features available for a specific role
 */
export function getRoleFeatures(role: UserRole): Feature[] {
  return Object.entries(FEATURE_CONFIG)
    .filter(([, config]) => config.requiredRoles?.includes(role))
    .map(([feature]) => feature as Feature)
}

/**
 * Check if feature requires upgrade
 */
export function requiresUpgrade(user: User | null, feature: Feature): boolean {
  const { hasAccess, upgradeRequired } = hasFeatureAccess(user, feature)
  return !hasAccess && upgradeRequired === true
}

/**
 * Get user's current access level
 */
export function getUserAccessLevel(user: User | null): AccessLevel {
  if (!user) return ACCESS_LEVELS.FREE

  if (isSuperAdmin(user)) return ACCESS_LEVELS.ADMIN
  if (isAdmin(user)) return ACCESS_LEVELS.ADMIN
  if (user.isPro) return ACCESS_LEVELS.PRO

  return ACCESS_LEVELS.FREE
}

/**
 * Feature gate component props helper
 */
export interface FeatureGateProps {
  feature: Feature
  user: User | null
  featureFlags?: FeatureFlag[]
  fallback?: React.ReactNode
  upgradePrompt?: React.ReactNode
}

/**
 * Utility to create feature-gated route guards
 */
export function createFeatureGuard(feature: Feature) {
  return (user: User | null, featureFlags?: FeatureFlag[]) => {
    return hasFeatureAccess(user, feature, featureFlags)
  }
}
