import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import { authSlice } from "./auth.slice"
import { uiSlice } from "./ui.slice"
import { rolesSlice } from "./roles.slice"
import type { AppStore } from "./types"

export const useStore = create<AppStore>()(
  devtools(
    persist(
      (...args) => ({
        ...authSlice(...args),
        ...uiSlice(...args),
        ...rolesSlice(...args),
      }),
      {
        name: "msmebazaar-store",
        partialize: (state) => ({
          // Only persist auth and user preferences
          user: state.user,
          currentRole: state.currentRole,
          theme: state.theme,
          sidebarCollapsed: state.sidebarCollapsed,
        }),
      },
    ),
    {
      name: "MSMEBazaar Store",
    },
  ),
)

// Export individual store hooks for convenience
export { useAuth } from "./auth.slice"
export { useUI } from "./ui.slice"
export { useRoles } from "./roles.slice"