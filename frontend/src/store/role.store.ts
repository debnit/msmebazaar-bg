"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { UserRole } from "@/types/user"

/**
 * Role-related state and actions for managing user roles
 * Handles active role switching and role-specific data
 */
interface RoleState {
  // Current active role
  activeRole: UserRole | null

  // Available roles for the current user
  availableRoles: UserRole[]

  // Role-specific permissions cache
  rolePermissions: Record<UserRole, string[]>

  // Role switching loading state
  isRoleSwitching: boolean
}

interface RoleActions {
  // Set available roles for user
  setAvailableRoles: (roles: UserRole[]) => void

  // Switch active role
  switchRole: (role: UserRole) => Promise<void>

  // Set role permissions
  setRolePermissions: (role: UserRole, permissions: string[]) => void

  // Check if user has specific role
  hasRole: (role: UserRole) => boolean

  // Check if user has permission for current role
  hasPermission: (permission: string) => boolean

  // Get role display name
  getRoleDisplayName: (role: UserRole) => string

  // Reset role state
  resetRoles: () => void
}

type RoleStore = RoleState & RoleActions

const initialState: RoleState = {
  activeRole: null,
  availableRoles: [],
  rolePermissions: {} as Record<UserRole, string[]>,
  isRoleSwitching: false,
}

/**
 * Zustand store for role management
 * Persists active role and available roles to localStorage
 */
export const useRoleStore = create<RoleStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setAvailableRoles: (roles: UserRole[]) => {
        set({ availableRoles: roles })

        // Set first available role as active if none is set
        const { activeRole } = get()
        if (!activeRole && roles.length > 0) {
          set({ activeRole: roles[0] })
        }
      },

      switchRole: async (role: UserRole) => {
        const { availableRoles } = get()

        if (!availableRoles.includes(role)) {
          throw new Error(`Role ${role} is not available for this user`)
        }

        set({ isRoleSwitching: true })

        try {
          // Simulate API call for role switching
          await new Promise((resolve) => setTimeout(resolve, 500))

          set({
            activeRole: role,
            isRoleSwitching: false,
          })

          // Trigger page refresh or navigation if needed
          window.location.reload()
        } catch (error) {
          set({ isRoleSwitching: false })
          throw error
        }
      },

      setRolePermissions: (role: UserRole, permissions: string[]) => {
        set((state) => ({
          rolePermissions: {
            ...state.rolePermissions,
            [role]: permissions,
          },
        }))
      },

      hasRole: (role: UserRole) => {
        const { availableRoles } = get()
        return availableRoles.includes(role)
      },

      hasPermission: (permission: string) => {
        const { activeRole, rolePermissions } = get()
        if (!activeRole) return false

        const permissions = rolePermissions[activeRole] || []
        return permissions.includes(permission)
      },

      getRoleDisplayName: (role: UserRole) => {
        const roleNames: Record<UserRole, string> = {
          msmeOwner: "MSME Owner",
          buyer: "Buyer",
          seller: "Seller",
          investor: "Investor",
          agent: "Agent",
          founder: "Founder",
          admin: "Admin",
          superadmin: "Super Admin",
        }
        return roleNames[role] || role
      },

      resetRoles: () => {
        set(initialState)
      },
    }),
    {
      name: "msme-roles-store",
      partialize: (state) => ({
        activeRole: state.activeRole,
        availableRoles: state.availableRoles,
        rolePermissions: state.rolePermissions,
      }),
    },
  ),
)

/**
 * Helper hook to get role-specific data
 */
export const useRoleHelpers = () => {
  const store = useRoleStore()

  return {
    ...store,

    // Check if current role is MSME Owner
    isMSMEOwner: store.activeRole === "msmeOwner",

    // Check if current role is Buyer
    isBuyer: store.activeRole === "buyer",

    // Check if current role is Seller
    isSeller: store.activeRole === "seller",

    // Check if current role is Investor
    isInvestor: store.activeRole === "investor",

    // Check if current role is Agent
    isAgent: store.activeRole === "agent",

    // Check if current role is Admin
    isAdmin: store.activeRole === "admin" || store.activeRole === "superadmin",

    // Get current role display name
    currentRoleDisplayName: store.activeRole ? store.getRoleDisplayName(store.activeRole) : "No Role",

    // Check if user can access admin features
    canAccessAdmin: store.hasRole("admin") || store.hasRole("superadmin"),

    // Check if user can switch roles
    canSwitchRoles: store.availableRoles.length > 1,
  }
}
