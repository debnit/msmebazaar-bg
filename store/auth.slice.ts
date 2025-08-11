import type { StateCreator } from "zustand"
import type { User, UserRole } from "@/types/user"
import type { AppStore, AuthState, AuthActions } from "./types"

export type AuthSlice = AuthState & AuthActions

export const authSlice: StateCreator<AppStore, [], [], AuthSlice> = (set, get) => ({
  // State
  user: null,
  isAuthenticated: false,
  currentRole: null,
  isPro: false,

  // Actions
  setUser: (user: User | null) => {
    set({
      user,
      isAuthenticated: !!user,
      isPro: user?.subscription?.plan === "PRO" || false,
      currentRole: user?.roles?.[0] || null, // Default to first role
    })
  },

  setCurrentRole: (role: UserRole | null) => {
    const { user } = get()
    if (user?.roles?.includes(role as UserRole) || role === null) {
      set({ currentRole: role })
    }
  },

  clearAuth: () => {
    set({
      user: null,
      isAuthenticated: false,
      currentRole: null,
      isPro: false,
    })
  },
})

// Hook for auth state
export const useAuth = () => {
  const store = get()
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    currentRole: store.currentRole,
    isPro: store.isPro,
    setUser: store.setUser,
    setCurrentRole: store.setCurrentRole,
    clearAuth: store.clearAuth,
  }
}