"use client"

import type React from "react"

import { useMemo } from "react"
import { useAuth } from "./use-auth"
import { useRoles } from "./use-roles"
import { usePro } from "./use-pro"
import { useFeatureFlags } from "../services/features.api"
import type { UserRole } from "../types/user"

export interface FeatureAccess {
  hasAccess: boolean
  reason?: string
  upgradeRequired?: boolean
}

export interface FeatureGateConfig {
  requiresPro?: boolean
  allowedRoles?: UserRole[]
  featureFlag?: string
  customCheck?: (user: any, roles: UserRole[], isPro: boolean) => boolean
}

/**
 * Hook to check feature access based on role, Pro status, and feature flags
 * Provides centralized feature gating logic for the entire application
 */
export function useFeatureAccess() {
  const { user, isAuthenticated } = useAuth()
  const { currentRole, userRoles } = useRoles()
  const { isPro, isProLoading } = usePro()
  const { data: featureFlags, isLoading: flagsLoading } = useFeatureFlags()

  /**
   * Check if user has access to a specific feature
   */
  const checkFeatureAccess = useMemo(() => {
    return (config: FeatureGateConfig): FeatureAccess => {
      // Not authenticated
      if (!isAuthenticated || !user) {
        return {
          hasAccess: false,
          reason: "Authentication required",
        }
      }

      // Loading states
      if (isProLoading || flagsLoading) {
        return {
          hasAccess: false,
          reason: "Loading user permissions...",
        }
      }

      // Check Pro requirement
      if (config.requiresPro && !isPro) {
        return {
          hasAccess: false,
          reason: "MSMEBazaar Pro subscription required",
          upgradeRequired: true,
        }
      }

      // Check role requirements
      if (config.allowedRoles && config.allowedRoles.length > 0) {
        const hasRequiredRole = config.allowedRoles.some((role) => userRoles.includes(role))

        if (!hasRequiredRole) {
          return {
            hasAccess: false,
            reason: `Required role: ${config.allowedRoles.join(" or ")}`,
          }
        }
      }

      // Check feature flag
      if (config.featureFlag) {
        const flagEnabled = featureFlags?.[config.featureFlag]
        if (!flagEnabled) {
          return {
            hasAccess: false,
            reason: "Feature not available",
          }
        }
      }

      // Custom check
      if (config.customCheck) {
        const customResult = config.customCheck(user, userRoles, isPro)
        if (!customResult) {
          return {
            hasAccess: false,
            reason: "Custom access requirements not met",
          }
        }
      }

      return { hasAccess: true }
    }
  }, [isAuthenticated, user, userRoles, isPro, isProLoading, flagsLoading, featureFlags])

  /**
   * Predefined feature access checks for common scenarios
   */
  const featureChecks = useMemo(
    () => ({
      // Business Loans
      basicLoan: checkFeatureAccess({
        allowedRoles: ["msmeOwner", "founder"],
      }),

      proLoanWorkspace: checkFeatureAccess({
        requiresPro: true,
        allowedRoles: ["msmeOwner", "founder"],
      }),

      // Business Valuation
      basicValuation: checkFeatureAccess({
        allowedRoles: ["msmeOwner", "founder", "investor"],
      }),

      detailedValuation: checkFeatureAccess({
        requiresPro: true,
        allowedRoles: ["msmeOwner", "founder", "investor"],
      }),

      // Exit Strategy
      exitStrategy: checkFeatureAccess({
        requiresPro: true,
        allowedRoles: ["msmeOwner", "founder"],
        featureFlag: "exit_strategy_enabled",
      }),

      // Market Linkage
      marketBrowse: checkFeatureAccess({
        allowedRoles: ["msmeOwner", "founder", "buyer", "seller"],
      }),

      rawMaterialProcurement: checkFeatureAccess({
        allowedRoles: ["msmeOwner", "founder", "buyer"],
      }),

      marketAccessPro: checkFeatureAccess({
        requiresPro: true,
        allowedRoles: ["msmeOwner", "founder", "seller"],
      }),

      // MSME Networking
      networking: checkFeatureAccess({
        allowedRoles: ["msmeOwner", "founder", "investor", "agent"],
      }),

      // Compliance
      compliance: checkFeatureAccess({
        allowedRoles: ["msmeOwner", "founder"],
      }),

      // Plant & Machinery
      plantMachinery: checkFeatureAccess({
        requiresPro: true,
        allowedRoles: ["msmeOwner", "founder"],
      }),

      // Leadership Training
      leadershipTraining: checkFeatureAccess({
        allowedRoles: ["msmeOwner", "founder"],
      }),

      // Agent Features
      agentDashboard: checkFeatureAccess({
        allowedRoles: ["agent"],
      }),

      // Admin Features
      adminPanel: checkFeatureAccess({
        allowedRoles: ["admin", "superadmin"],
      }),

      userManagement: checkFeatureAccess({
        allowedRoles: ["admin", "superadmin"],
      }),

      // Super Admin Features
      superAdminPanel: checkFeatureAccess({
        allowedRoles: ["superadmin"],
      }),
    }),
    [checkFeatureAccess],
  )

  /**
   * Check if user can access a specific route
   */
  const canAccessRoute = useMemo(() => {
    return (route: string): FeatureAccess => {
      // Route-based access control
      const routeConfig: Record<string, FeatureGateConfig> = {
        "/dashboard": { allowedRoles: ["msmeOwner", "founder", "buyer", "seller", "investor", "agent"] },
        "/business-loans": { allowedRoles: ["msmeOwner", "founder"] },
        "/business-loans/pro": { requiresPro: true, allowedRoles: ["msmeOwner", "founder"] },
        "/business-valuation": { allowedRoles: ["msmeOwner", "founder", "investor"] },
        "/business-valuation/detailed": { requiresPro: true, allowedRoles: ["msmeOwner", "founder", "investor"] },
        "/exit-strategy": { requiresPro: true, allowedRoles: ["msmeOwner", "founder"] },
        "/market-linkage": { allowedRoles: ["msmeOwner", "founder", "buyer", "seller"] },
        "/market-linkage/pro": { requiresPro: true, allowedRoles: ["msmeOwner", "founder", "seller"] },
        "/msme-networking": { allowedRoles: ["msmeOwner", "founder", "investor", "agent"] },
        "/compliance": { allowedRoles: ["msmeOwner", "founder"] },
        "/plant-machinery": { requiresPro: true, allowedRoles: ["msmeOwner", "founder"] },
        "/leadership-training": { allowedRoles: ["msmeOwner", "founder"] },
        "/agent": { allowedRoles: ["agent"] },
        "/admin": { allowedRoles: ["admin", "superadmin"] },
        "/superadmin": { allowedRoles: ["superadmin"] },
      }

      const config = routeConfig[route]
      if (!config) {
        return { hasAccess: true } // Allow access to unprotected routes
      }

      return checkFeatureAccess(config)
    }
  }, [checkFeatureAccess])

  /**
   * Get upgrade message for Pro features
   */
  const getUpgradeMessage = (featureName: string): string => {
    return `Upgrade to MSMEBazaar Pro to access ${featureName}. Get advanced features, priority support, and exclusive tools for just ₹99/month.`
  }

  return {
    checkFeatureAccess,
    featureChecks,
    canAccessRoute,
    getUpgradeMessage,
    isLoading: isProLoading || flagsLoading,
  }
}

/**
 * Higher-order component for feature gating
 */
export function withFeatureAccess<P extends object>(
  Component: React.ComponentType<P>,
  config: FeatureGateConfig,
  fallback?: React.ComponentType<{ reason?: string; upgradeRequired?: boolean }>,
) {
  return function FeatureGatedComponent(props: P) {
    const { checkFeatureAccess } = useFeatureAccess()
    const access = checkFeatureAccess(config)

    if (!access.hasAccess) {
      if (fallback) {
        const FallbackComponent = fallback
        return <FallbackComponent reason={access.reason} upgradeRequired={access.upgradeRequired} />
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-lg font-semibold text-gray-900 mb-2">Access Restricted</div>
          <div className="text-gray-600 mb-4">{access.reason}</div>
          {access.upgradeRequired && (
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Upgrade to Pro</button>
          )}
        </div>
      )
    }

    return <Component {...props} />
  }
}
