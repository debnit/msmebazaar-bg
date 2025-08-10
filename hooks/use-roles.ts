"use client"

import { useCallback, useMemo } from "react"
import { useAuthStore } from "@/store/auth.store"
import { useRolesStore } from "@/store/roles.store"
import type { UserRole } from "@/types/user"
import { toast } from "@/hooks/use-toast"

/**
 * Custom hook for role management and role-specific logic
 * Handles role switching, permissions, and role-based UI state
 */
export const useRoles = () => {
  const { user, roles: userRoles } = useAuthStore()
  const { activeRole, rolePermissions, setActiveRole, addRole, removeRole, updateRolePermissions, getRoleConfig } =
    useRolesStore()

  /**
   * Switch to a different role if user has permission
   */
  const switchRole = useCallback(
    (role: UserRole) => {
      if (!userRoles.includes(role)) {
        toast({
          title: "Access Denied",
          description: `You don't have permission to switch to ${role} role`,
          variant: "destructive",
        })
        return false
      }

      setActiveRole(role)
      toast({
        title: "Role Switched",
        description: `Switched to ${role} role`,
      })
      return true
    },
    [userRoles, setActiveRole],
  )

  /**
   * Check if user has a specific role
   */
  const hasRole = useCallback(
    (role: UserRole): boolean => {
      return userRoles.includes(role)
    },
    [userRoles],
  )

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = useCallback(
    (roles: UserRole[]): boolean => {
      return roles.some((role) => userRoles.includes(role))
    },
    [userRoles],
  )

  /**
   * Check if user has all specified roles
   */
  const hasAllRoles = useCallback(
    (roles: UserRole[]): boolean => {
      return roles.every((role) => userRoles.includes(role))
    },
    [userRoles],
  )

  /**
   * Check if user can perform a specific action based on current role
   */
  const canPerformAction = useCallback(
    (action: string): boolean => {
      if (!activeRole) return false
      const permissions = rolePermissions[activeRole]
      return permissions?.includes(action) || false
    },
    [activeRole, rolePermissions],
  )

  /**
   * Get available roles for the current user
   */
  const availableRoles = useMemo(() => {
    return userRoles.map((role) => ({
      role,
      config: getRoleConfig(role),
      isActive: role === activeRole,
    }))
  }, [userRoles, activeRole, getRoleConfig])

  /**
   * Get role-specific navigation items
   */
  const getRoleNavigation = useCallback(() => {
    if (!activeRole) return []

    const roleConfig = getRoleConfig(activeRole)
    return roleConfig?.navigation || []
  }, [activeRole, getRoleConfig])

  /**
   * Get role-specific dashboard widgets
   */
  const getRoleDashboardWidgets = useCallback(() => {
    if (!activeRole) return []

    const roleConfig = getRoleConfig(activeRole)
    return roleConfig?.dashboardWidgets || []
  }, [activeRole, getRoleConfig])

  /**
   * Check if current role has access to a specific feature
   */
  const hasFeatureAccess = useCallback(
    (feature: string): boolean => {
      if (!activeRole) return false

      const roleConfig = getRoleConfig(activeRole)
      return roleConfig?.features?.includes(feature) || false
    },
    [activeRole, getRoleConfig],
  )

  /**
   * Get role display information
   */
  const getRoleDisplayInfo = useCallback(
    (role: UserRole) => {
      const config = getRoleConfig(role)
      return {
        name: config?.displayName || role,
        description: config?.description || "",
        icon: config?.icon || "User",
        color: config?.color || "blue",
      }
    },
    [getRoleConfig],
  )

  /**
   * Check if user is admin (admin or superadmin)
   */
  const isAdmin = useMemo(() => {
    return hasAnyRole(["admin", "superadmin"])
  }, [hasAnyRole])

  /**
   * Check if user is superadmin
   */
  const isSuperAdmin = useMemo(() => {
    return hasRole("superadmin")
  }, [hasRole])

  /**
   * Check if user is MSME owner
   */
  const isMSMEOwner = useMemo(() => {
    return hasRole("msmeOwner")
  }, [hasRole])

  /**
   * Check if user is agent
   */
  const isAgent = useMemo(() => {
    return hasRole("agent")
  }, [hasRole])

  /**
   * Check if user is investor
   */
  const isInvestor = useMemo(() => {
    return hasRole("investor")
  }, [hasRole])

  /**
   * Get role-specific home route
   */
  const getRoleHomeRoute = useCallback(() => {
    if (!activeRole) return "/dashboard"

    const roleConfig = getRoleConfig(activeRole)
    return roleConfig?.homeRoute || "/dashboard"
  }, [activeRole, getRoleConfig])

  /**
   * Add a new role to user (admin function)
   */
  const assignRole = useCallback(
    (role: UserRole) => {
      if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "Only admins can assign roles",
          variant: "destructive",
        })
        return false
      }

      addRole(role)
      toast({
        title: "Role Assigned",
        description: `${role} role has been assigned`,
      })
      return true
    },
    [isAdmin, addRole],
  )

  /**
   * Remove a role from user (admin function)
   */
  const unassignRole = useCallback(
    (role: UserRole) => {
      if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "Only admins can remove roles",
          variant: "destructive",
        })
        return false
      }

      if (role === activeRole && userRoles.length > 1) {
        // Switch to first available role if removing active role
        const nextRole = userRoles.find((r) => r !== role)
        if (nextRole) {
          setActiveRole(nextRole)
        }
      }

      removeRole(role)
      toast({
        title: "Role Removed",
        description: `${role} role has been removed`,
      })
      return true
    },
    [isAdmin, activeRole, userRoles, removeRole, setActiveRole],
  )

  return {
    // Current state
    activeRole,
    userRoles,
    availableRoles,

    // Role switching
    switchRole,

    // Role checks
    hasRole,
    hasAnyRole,
    hasAllRoles,
    canPerformAction,
    hasFeatureAccess,

    // Role information
    getRoleDisplayInfo,
    getRoleNavigation,
    getRoleDashboardWidgets,
    getRoleHomeRoute,

    // Convenience flags
    isAdmin,
    isSuperAdmin,
    isMSMEOwner,
    isAgent,
    isInvestor,

    // Admin functions
    assignRole,
    unassignRole,
  }
}

export default useRoles
