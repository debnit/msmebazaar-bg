import type { User, UserRole } from "@/types/user"

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  currentRole: UserRole | null
  isPro: boolean
}

export interface AuthActions {
  setUser: (user: User | null) => void
  setCurrentRole: (role: UserRole | null) => void
  clearAuth: () => void
}

export interface UIState {
  theme: "light" | "dark" | "system"
  sidebarCollapsed: boolean
  isLoading: boolean
  notifications: Notification[]
}

export interface UIActions {
  setTheme: (theme: "light" | "dark" | "system") => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setLoading: (loading: boolean) => void
  addNotification: (notification: Omit<Notification, "id">) => void
  removeNotification: (id: string) => void
}

export interface RolesState {
  availableRoles: UserRole[]
  rolePermissions: Record<UserRole, string[]>
}

export interface RolesActions {
  setAvailableRoles: (roles: UserRole[]) => void
  hasPermission: (permission: string) => boolean
  canAccessFeature: (feature: string) => boolean
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "success" | "error" | "warning" | "info"
  timestamp: Date
}

export type AppStore = AuthState & AuthActions & UIState & UIActions & RolesState & RolesActions