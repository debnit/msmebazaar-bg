import type { StateCreator } from "zustand"
import type { UserRole } from "@/types/user"
import type { AppStore, RolesState, RolesActions } from "./types"

export type RolesSlice = RolesState & RolesActions

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  BUYER: ["view_loans", "apply_loan", "view_valuation", "request_market_linkage"],
  SELLER: ["create_listings", "manage_inventory", "view_analytics", "escrow_setup"],
  INVESTOR: ["view_opportunities", "invest", "portfolio_management", "due_diligence"],
  AGENT: ["manage_clients", "commission_tracking", "lead_generation"],
  MSME_OWNER: ["business_management", "compliance_tracking", "growth_tools"],
  FOUNDER: ["startup_tools", "funding_access", "mentor_connect", "pitch_deck"],
  ADMIN: ["user_management", "service_approval", "analytics_reports", "escrow_management"],
  SUPER_ADMIN: ["system_monitoring", "user_management", "feature_toggles", "error_logs"],
}

export const rolesSlice: StateCreator<AppStore, [], [], RolesSlice> = (set, get) => ({
  // State
  availableRoles: [],
  rolePermissions: ROLE_PERMISSIONS,

  // Actions
  setAvailableRoles: (roles) => set({ availableRoles: roles }),

  hasPermission: (permission: string) => {
    const { user, currentRole } = get()
    if (!user || !currentRole) return false

    const permissions = ROLE_PERMISSIONS[currentRole] || []
    return permissions.includes(permission)
  },

  canAccessFeature: (feature: string) => {
    const { user, currentRole, isPro } = get()
    if (!user || !currentRole) return false

    // Define feature access rules
    const featureAccess: Record<string, { roles: UserRole[]; requiresPro?: boolean }> = {
      business_loans: { roles: ["BUYER", "MSME_OWNER", "FOUNDER"] },
      business_valuation: { roles: ["BUYER", "SELLER", "INVESTOR", "MSME_OWNER"] },
      market_linkage: { roles: ["BUYER", "SELLER", "MSME_OWNER"] },
      navarambh: { roles: ["FOUNDER", "MSME_OWNER"] },
      msme_networking: { roles: ["BUYER", "SELLER", "MSME_OWNER", "FOUNDER"] },
      compliance: { roles: ["MSME_OWNER", "FOUNDER", "ADMIN"] },
      plant_machinery: { roles: ["MSME_OWNER", "BUYER"] },
      leadership_training: { roles: ["MSME_OWNER", "FOUNDER"], requiresPro: true },
      advanced_analytics: { roles: ["SELLER", "INVESTOR", "ADMIN"], requiresPro: true },
      priority_support: { roles: ["BUYER", "SELLER", "INVESTOR"], requiresPro: true },
    }

    const access = featureAccess[feature]
    if (!access) return false

    const hasRole = access.roles.includes(currentRole)
    const hasProAccess = !access.requiresPro || isPro

    return hasRole && hasProAccess
  },
})

// Hook for roles state
export const useRoles = () => {
  const store = get()
  return {
    availableRoles: store.availableRoles,
    rolePermissions: store.rolePermissions,
    setAvailableRoles: store.setAvailableRoles,
    hasPermission: store.hasPermission,
    canAccessFeature: store.canAccessFeature,
  }
}