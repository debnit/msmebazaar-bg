import type { StateCreator } from "zustand"
import type { AppStore, UIState, UIActions, Notification } from "./types"

export type UISlice = UIState & UIActions

export const uiSlice: StateCreator<AppStore, [], [], UISlice> = (set, get) => ({
  // State
  theme: "system",
  sidebarCollapsed: false,
  isLoading: false,
  notifications: [],

  // Actions
  setTheme: (theme) => set({ theme }),

  toggleSidebar: () => {
    const { sidebarCollapsed } = get()
    set({ sidebarCollapsed: !sidebarCollapsed })
  },

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  setLoading: (loading) => set({ isLoading: loading }),

  addNotification: (notification) => {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
    }

    set((state) => ({
      notifications: [newNotification, ...state.notifications].slice(0, 5), // Keep only 5 recent
    }))

    // Auto-remove after 5 seconds
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }))
    }, 5000)
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },
})

// Hook for UI state
export const useUI = () => {
  const store = get()
  return {
    theme: store.theme,
    sidebarCollapsed: store.sidebarCollapsed,
    isLoading: store.isLoading,
    notifications: store.notifications,
    setTheme: store.setTheme,
    toggleSidebar: store.toggleSidebar,
    setSidebarCollapsed: store.setSidebarCollapsed,
    setLoading: store.setLoading,
    addNotification: store.addNotification,
    removeNotification: store.removeNotification,
  }
}