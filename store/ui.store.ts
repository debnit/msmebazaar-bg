"use client"

import { create } from "zustand"
import { devtools } from "zustand/middleware"

/**
 * UI State Interface
 * Manages global UI state including modals, toasts, loading states, and sidebar
 */
interface UIState {
  // Modal state
  modals: {
    [key: string]: boolean
  }

  // Toast state
  toasts: Array<{
    id: string
    type: "success" | "error" | "warning" | "info"
    title: string
    message?: string
    duration?: number
  }>

  // Loading states
  loading: {
    global: boolean
    [key: string]: boolean
  }

  // Sidebar state
  sidebar: {
    isOpen: boolean
    isCollapsed: boolean
  }

  // Theme state
  theme: "light" | "dark" | "system"

  // Mobile state
  isMobile: boolean
}

/**
 * UI Actions Interface
 * Defines all actions available for UI state management
 */
interface UIActions {
  // Modal actions
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
  closeAllModals: () => void
  isModalOpen: (modalId: string) => boolean

  // Toast actions
  addToast: (toast: Omit<UIState["toasts"][0], "id">) => void
  removeToast: (toastId: string) => void
  clearToasts: () => void

  // Loading actions
  setLoading: (key: string, isLoading: boolean) => void
  setGlobalLoading: (isLoading: boolean) => void
  isLoading: (key?: string) => boolean

  // Sidebar actions
  toggleSidebar: () => void
  setSidebarOpen: (isOpen: boolean) => void
  toggleSidebarCollapse: () => void
  setSidebarCollapsed: (isCollapsed: boolean) => void

  // Theme actions
  setTheme: (theme: UIState["theme"]) => void

  // Mobile actions
  setIsMobile: (isMobile: boolean) => void

  // Reset action
  resetUI: () => void
}

type UIStore = UIState & UIActions

/**
 * Initial UI state
 */
const initialState: UIState = {
  modals: {},
  toasts: [],
  loading: {
    global: false,
  },
  sidebar: {
    isOpen: true,
    isCollapsed: false,
  },
  theme: "system",
  isMobile: false,
}

/**
 * UI Store
 * Global state management for UI-related state using Zustand
 */
export const useUIStore = create<UIStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Modal actions
      openModal: (modalId: string) =>
        set(
          (state) => ({
            modals: {
              ...state.modals,
              [modalId]: true,
            },
          }),
          false,
          "openModal",
        ),

      closeModal: (modalId: string) =>
        set(
          (state) => ({
            modals: {
              ...state.modals,
              [modalId]: false,
            },
          }),
          false,
          "closeModal",
        ),

      closeAllModals: () =>
        set(
          (state) => ({
            modals: Object.keys(state.modals).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
          }),
          false,
          "closeAllModals",
        ),

      isModalOpen: (modalId: string) => {
        const state = get()
        return state.modals[modalId] || false
      },

      // Toast actions
      addToast: (toast) =>
        set(
          (state) => ({
            toasts: [
              ...state.toasts,
              {
                ...toast,
                id: `toast-${Date.now()}-${Math.random()}`,
                duration: toast.duration || 5000,
              },
            ],
          }),
          false,
          "addToast",
        ),

      removeToast: (toastId: string) =>
        set(
          (state) => ({
            toasts: state.toasts.filter((toast) => toast.id !== toastId),
          }),
          false,
          "removeToast",
        ),

      clearToasts: () => set({ toasts: [] }, false, "clearToasts"),

      // Loading actions
      setLoading: (key: string, isLoading: boolean) =>
        set(
          (state) => ({
            loading: {
              ...state.loading,
              [key]: isLoading,
            },
          }),
          false,
          "setLoading",
        ),

      setGlobalLoading: (isLoading: boolean) =>
        set(
          (state) => ({
            loading: {
              ...state.loading,
              global: isLoading,
            },
          }),
          false,
          "setGlobalLoading",
        ),

      isLoading: (key?: string) => {
        const state = get()
        if (!key) return state.loading.global
        return state.loading[key] || false
      },

      // Sidebar actions
      toggleSidebar: () =>
        set(
          (state) => ({
            sidebar: {
              ...state.sidebar,
              isOpen: !state.sidebar.isOpen,
            },
          }),
          false,
          "toggleSidebar",
        ),

      setSidebarOpen: (isOpen: boolean) =>
        set(
          (state) => ({
            sidebar: {
              ...state.sidebar,
              isOpen,
            },
          }),
          false,
          "setSidebarOpen",
        ),

      toggleSidebarCollapse: () =>
        set(
          (state) => ({
            sidebar: {
              ...state.sidebar,
              isCollapsed: !state.sidebar.isCollapsed,
            },
          }),
          false,
          "toggleSidebarCollapse",
        ),

      setSidebarCollapsed: (isCollapsed: boolean) =>
        set(
          (state) => ({
            sidebar: {
              ...state.sidebar,
              isCollapsed,
            },
          }),
          false,
          "setSidebarCollapsed",
        ),

      // Theme actions
      setTheme: (theme: UIState["theme"]) => set({ theme }, false, "setTheme"),

      // Mobile actions
      setIsMobile: (isMobile: boolean) => set({ isMobile }, false, "setIsMobile"),

      // Reset action
      resetUI: () => set(initialState, false, "resetUI"),
    }),
    {
      name: "msmebazaar-ui-store",
      partialize: (state) => ({
        theme: state.theme,
        sidebar: state.sidebar,
      }),
    },
  ),
)

/**
 * UI Store Selectors
 * Optimized selectors for common UI state access patterns
 */
export const useUISelectors = {
  // Modal selectors
  useModal: (modalId: string) =>
    useUIStore((state) => ({
      isOpen: state.modals[modalId] || false,
      open: () => state.openModal(modalId),
      close: () => state.closeModal(modalId),
    })),

  // Toast selectors
  useToasts: () =>
    useUIStore((state) => ({
      toasts: state.toasts,
      addToast: state.addToast,
      removeToast: state.removeToast,
      clearToasts: state.clearToasts,
    })),

  // Loading selectors
  useLoading: (key?: string) =>
    useUIStore((state) => ({
      isLoading: key ? state.loading[key] || false : state.loading.global,
      setLoading: (loading: boolean) => (key ? state.setLoading(key, loading) : state.setGlobalLoading(loading)),
    })),

  // Sidebar selectors
  useSidebar: () =>
    useUIStore((state) => ({
      isOpen: state.sidebar.isOpen,
      isCollapsed: state.sidebar.isCollapsed,
      toggle: state.toggleSidebar,
      setOpen: state.setSidebarOpen,
      toggleCollapse: state.toggleSidebarCollapse,
      setCollapsed: state.setSidebarCollapsed,
    })),

  // Theme selectors
  useTheme: () =>
    useUIStore((state) => ({
      theme: state.theme,
      setTheme: state.setTheme,
    })),

  // Mobile selectors
  useMobile: () =>
    useUIStore((state) => ({
      isMobile: state.isMobile,
      setIsMobile: state.setIsMobile,
    })),
}

export default useUIStore
