"use client";

import React, { useMemo } from "react";
import { useAuth } from "./use-auth";
import { useRoles } from "./use-roles";
import { usePro } from "./use-Pro";
import { useFeatureFlag } from "../services/features.api";
import type { UserRole } from "../types/user";
import type { FeatureFlagKey } from "../types/features";

/** Strongly typed feature gate config */
export interface FeatureGateConfig {
  requiresPro?: boolean;
  allowedRoles?: UserRole[];
  featureFlag?: FeatureFlagKey; // Use enum or union of valid flags
  customCheck?: (user: any, roles: UserRole[], isPro: boolean) => boolean;
}

export interface FeatureAccess {
  hasAccess: boolean;
  reason?: string;
  upgradeRequired?: boolean;
}

/** Memoized route config outside hook to prevent recreation */
const routeConfig: Record<string, FeatureGateConfig> = {
  "/dashboard": { allowedRoles: ["msmeOwner", "founder", "buyer", "seller", "investor", "agent"] },
  "/business-loans": { allowedRoles: ["msmeOwner", "founder"] },
  "/business-loans/pro": { requiresPro: true, allowedRoles: ["msmeOwner", "founder"] },
  "/business-valuation": { allowedRoles: ["msmeOwner", "founder", "investor"] },
  "/business-valuation/detailed": { requiresPro: true, allowedRoles: ["msmeOwner", "founder", "investor"] },
  "/exit-strategy": { requiresPro: true, allowedRoles: ["msmeOwner", "founder"], featureFlag: "exit_strategy_enabled" },
  "/market-linkage": { allowedRoles: ["msmeOwner", "founder", "buyer", "seller"] },
  "/market-linkage/pro": { requiresPro: true, allowedRoles: ["msmeOwner", "founder", "seller"] },
  "/msme-networking": { allowedRoles: ["msmeOwner", "founder", "investor", "agent"] },
  "/compliance": { allowedRoles: ["msmeOwner", "founder"] },
  "/plant-machinery": { requiresPro: true, allowedRoles: ["msmeOwner", "founder"] },
  "/leadership-training": { allowedRoles: ["msmeOwner", "founder"] },
  "/agent": { allowedRoles: ["agent"] },
  "/admin": { allowedRoles: ["admin", "superadmin"] },
  "/superadmin": { allowedRoles: ["superadmin"] },
};

export function useFeatureAccess() {
  const { user, isAuthenticated } = useAuth();
  const { userRoles } = useRoles();
  const { isPro, isProLoading, upgradeToPro } = usePro();
  const { data: featureFlags, isLoading: flagsLoading } = useFeatureFlag();

  /** Check access based on config */
  const checkFeatureAccess = React.useCallback(
    (config: FeatureGateConfig): FeatureAccess => {
      if (!isAuthenticated || !user) {
        return { hasAccess: false, reason: "Authentication required" };
      }
      if (isProLoading || flagsLoading) {
        return { hasAccess: false, reason: "Loading user permissions..." };
      }
      if (config.requiresPro && !isPro) {
        return { hasAccess: false, reason: "MSMEBazaar Pro subscription required", upgradeRequired: true };
      }
      if (config.allowedRoles && config.allowedRoles.length > 0) {
        const hasRole = config.allowedRoles.some((role) => userRoles.includes(role));
        if (!hasRole) {
          return { hasAccess: false, reason: `Required role: ${config.allowedRoles.join(" or ")}` };
        }
      }
      if (config.featureFlag) {
        const featureFlagEnabled = !!featureFlags?.[config.featureFlag];
        if (!featureFlagEnabled) {
          return { hasAccess: false, reason: "Feature not available" };
        }
      }
      if (config.customCheck) {
        const result = config.customCheck(user, userRoles, isPro);
        if (!result) {
          return { hasAccess: false, reason: "Custom access requirements not met" };
        }
      }
      return { hasAccess: true };
    },
    [user, isAuthenticated, isPro, userRoles, isProLoading, flagsLoading, featureFlags]
  );

  /** Common checks for features */
  const featureChecks = useMemo(() => ({
    basicLoan: checkFeatureAccess({ allowedRoles: ["msmeOwner", "founder"] }),
    proLoanWorkspace: checkFeatureAccess({ requiresPro: true, allowedRoles: ["msmeOwner", "founder"] }),
    basicValuation: checkFeatureAccess({ allowedRoles: ["msmeOwner", "founder", "investor"] }),
    detailedValuation: checkFeatureAccess({ requiresPro: true, allowedRoles: ["msmeOwner", "founder", "investor"] }),
    exitStrategy: checkFeatureAccess({ requiresPro: true, allowedRoles: ["msmeOwner", "founder"], featureFlag: "exit_strategy_enabled" }),
    marketBrowse: checkFeatureAccess({ allowedRoles: ["msmeOwner", "founder", "buyer", "seller"] }),
    rawMaterialProcurement: checkFeatureAccess({ allowedRoles: ["msmeOwner", "founder", "buyer"] }),
    marketAccessPro: checkFeatureAccess({ requiresPro: true, allowedRoles: ["msmeOwner", "founder", "seller"] }),
    networking: checkFeatureAccess({ allowedRoles: ["msmeOwner", "founder", "investor", "agent"] }),
    compliance: checkFeatureAccess({ allowedRoles: ["msmeOwner", "founder"] }),
    plantMachinery: checkFeatureAccess({ requiresPro: true, allowedRoles: ["msmeOwner", "founder"] }),
    leadershipTraining: checkFeatureAccess({ allowedRoles: ["msmeOwner", "founder"] }),
    agentDashboard: checkFeatureAccess({ allowedRoles: ["agent"] }),
    adminPanel: checkFeatureAccess({ allowedRoles: ["admin", "superadmin"] }),
    userManagement: checkFeatureAccess({ allowedRoles: ["admin", "superadmin"] }),
    superAdminPanel: checkFeatureAccess({ allowedRoles: ["superadmin"] }),
  }), [checkFeatureAccess]);

  /** Route-based access check */
  const canAccessRoute = React.useCallback(
    (route: string): FeatureAccess => {
      const config = routeConfig[route];
      if (!config) {
        // Default allow unprotected routes
        return { hasAccess: true };
      }
      return checkFeatureAccess(config);
    },
    [checkFeatureAccess]
  );

  /** Upgrade message */
  const getUpgradeMessage = React.useCallback(
    (featureName: string) =>
      `Upgrade to MSMEBazaar Pro to access ${featureName}. Get advanced features, priority support, and exclusive tools for just ₹99/month.`,
    []
  );

  /** HOC for gating */
  const withFeatureAccess = <P extends object>(
    Component: React.ComponentType<P>,
    config: FeatureGateConfig,
    fallback?: React.ComponentType<{ reason?: string; upgradeRequired?: boolean }>
  ): React.FC<P> => {
    const FeatureGatedComponent: React.FC<P> = (props) => {
      const access = checkFeatureAccess(config);

      if (!access.hasAccess) {
        if (fallback) {
          const Fallback = fallback;
          return <Fallback reason={access.reason} upgradeRequired={access.upgradeRequired} />;
        }

        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="text-lg font-semibold text-gray-900 mb-2">Access Restricted</div>
            <div className="text-gray-600 mb-4">{access.reason}</div>
            {access.upgradeRequired && (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={upgradeToPro}
              >
                Upgrade to Pro
              </button>
            )}
          </div>
        );
      }

      return <Component {...props} />;
    };

    FeatureGatedComponent.displayName = `withFeatureAccess(${Component.displayName || Component.name || "Component"})`;

    return FeatureGatedComponent;
  };

  return {
    checkFeatureAccess,
    featureChecks,
    canAccessRoute,
    getUpgradeMessage,
    withFeatureAccess,
    isLoading: isProLoading || flagsLoading,
  };
}
