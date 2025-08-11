"use client"

import type React from "react"

import { create } from "zustand"

/**
 * Modal state interface
 */
interface ModalState {
  isOpen: boolean
  title?: string
  content?: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
  closable?: boolean
  onClose?: () => void
}

/**
 * Toast notification interface
 */
interface ToastNotification {
  id: string
  title?: string
  message: string
  type: "success" | "error" | "warning" | "info"
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * Loading state interface
 */
interface LoadingState {
  isLoading: boolean
  message?: string
  progress?: number
}

/**
 * Sidebar state interface
 */
interface SidebarState {
  isOpen: boolean
  isCollapsed: boolean
  activeSection?: string
}

/**
 * UI state interface
 */
interface UIState {
  // Modal management
  modal: ModalState

  // Toast notifications
  toasts: ToastNotification[]

  // Global loading states
  globalLoading: LoadingState
  pageLoading: LoadingState

  // Sidebar state
  sidebar: SidebarState

  // Theme and appearance
  theme: "light" | "dark" | "system"
  sidebarTheme: "light" | "dark"

  // Mobile responsiveness
  isMobile: boolean
  screenSize: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

  // Feature flags for UI
  showBetaFeatures: boolean
  showDebugInfo: boolean
}

/**
 * UI actions interface
 */
interface UIActions {
  // Modal actions
  openModal: (config: Partial<ModalState>) => void
  closeModal: () => void
  updateModal: (updates: Partial<ModalState>) => void

  // Toast actions
  addToast: (toast: Omit<ToastNotification, "id">) => void
  removeToast: (id: string) => void
  clearToasts: () => void

  // Loading actions
  setGlobalLoading: (loading: boolean, message?: string, progress?: number) => void
  setPageLoading: (loading: boolean, message?: string) => void

  // Sidebar actions
  toggleSidebar: () => void
  setSidebarOpen: (isOpen: boolean) => void
  toggleSidebarCollapse: () => void
  setSidebarCollapsed: (isCollapsed: boolean) => void
  setActiveSidebarSection: (section: string) => void

  // Theme actions
  setTheme: (theme: "light" | "dark" | "system") => void
  setSidebarTheme: (theme: "light" | "dark") => void

  // Responsive actions
  setIsMobile: (isMobile: boolean) => void
  setScreenSize: (size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl") => void

  // Feature flag actions
  toggleBetaFeatures: () => void
  toggleDebugInfo: () => void

  // Utility actions
  resetUI: () => void
}

type UIStore = UIState & UIActions

const initialState: UIState = {
  modal: {
    isOpen: false,
    size: "md",
    closable: true,
  },
  toasts: [],
  globalLoading: {
    isLoading: false,
  },
  pageLoading: {
    isLoading: false,
  },
  sidebar: {
    isOpen: true,
    isCollapsed: false,
  },
  theme: "system",
  sidebarTheme: "light",
  isMobile: false,
  screenSize: "lg",
  showBetaFeatures: false,
  showDebugInfo: false,
}

/**
 * Zustand store for UI state management
 * Handles modals, toasts, loading states, sidebar, and theme
 */
export const useUIStore = create<UIStore>()((set, get) => ({
  ...initialState,

  // Modal actions
  openModal: (config: Partial<ModalState>) => {
    set((state) => ({
      modal: {
        ...state.modal,
        ...config,
        isOpen: true,
      },
    }))
  },

  closeModal: () => {
    const { modal } = get()
    if (modal.onClose) {
      modal.onClose()
    }
    set((state) => ({
      modal: {
        ...state.modal,
        isOpen: false,
        content: undefined,
        onClose: undefined,
      },
    }))
  },

  updateModal: (updates: Partial<ModalState>) => {
    set((state) => ({
      modal: {
        ...state.modal,
        ...updates,
      },
    }))
  },

  // Toast actions
  addToast: (toast: Omit<ToastNotification, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastNotification = {
      ...toast,
      id,
      duration: toast.duration || 5000,
    }

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }))

    // Auto-remove toast after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id)
      }, newToast.duration)
    }
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }))
  },

  clearToasts: () => {
    set({ toasts: [] })
  },

  // Loading actions
  setGlobalLoading: (isLoading: boolean, message?: string, progress?: number) => {
    set({
      globalLoading: {
        isLoading,
        message,
        progress,
      },
    })
  },

  setPageLoading: (isLoading: boolean, message?: string) => {
    set({
      pageLoading: {
        isLoading,
        message,
      },
    })
  },

  // Sidebar actions
  toggleSidebar: () => {
    set((state) => ({
      sidebar: {
        ...state.sidebar,
        isOpen: !state.sidebar.isOpen,
      },
    }))
  },

  setSidebarOpen: (isOpen: boolean) => {
    set((state) => ({
      sidebar: {
        ...state.sidebar,
        isOpen,
      },
    }))
  },

  toggleSidebarCollapse: () => {
    set((state) => ({
      sidebar: {
        ...state.sidebar,
        isCollapsed: !state.sidebar.isCollapsed,
      },
    }))
  },

  setSidebarCollapsed: (isCollapsed: boolean) => {
    set((state) => ({
      sidebar: {
        ...state.sidebar,
        isCollapsed,
      },
    }))
  },

  setActiveSidebarSection: (activeSection: string) => {
    set((state) => ({
      sidebar: {
        ...state.sidebar,
        activeSection,
      },
    }))
  },

  // Theme actions
  setTheme: (theme: "light" | "dark" | "system") => {
    set({ theme })

    // Apply theme to document
    if (typeof window !== "undefined") {
      const root = window.document.documentElement
      root.classList.remove("light", "dark")

      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        root.classList.add(systemTheme)
      } else {
        root.classList.add(theme)
      }
    }
  },

  setSidebarTheme: (sidebarTheme: "light" | "dark") => {
    set({ sidebarTheme })
  },

  // Responsive actions
  setIsMobile: (isMobile: boolean) => {
    set({ isMobile })

    // Auto-collapse sidebar on mobile
    if (isMobile) {
      set((state) => ({
        sidebar: {
          ...state.sidebar,
          isOpen: false,
        },
      }))
    }
  },

  setScreenSize: (screenSize: "xs" | "sm" | "md" | "lg" | "xl" | "2xl") => {
    set({ screenSize })

    // Update mobile state based on screen size
    const isMobile = screenSize === "xs" || screenSize === "sm"
    if (get().isMobile !== isMobile) {
      get().setIsMobile(isMobile)
    }
  },

  // Feature flag actions
  toggleBetaFeatures: () => {
    set((state) => ({
      showBetaFeatures: !state.showBetaFeatures,
    }))
  },

  toggleDebugInfo: () => {
    set((state) => ({
      showDebugInfo: !state.showDebugInfo,
    }))
  },

  // Utility actions
  resetUI: () => {
    set(initialState)
  },
}))

/**
 * Selector hooks for specific UI state slices
 */
export const useModal = () => useUIStore((state) => state.modal)
export const useToasts = () => useUIStore((state) => state.toasts)
export const useGlobalLoading = () => useUIStore((state) => state.globalLoading)
export const usePageLoading = () => useUIStore((state) => state.pageLoading)
export const useSidebar = () => useUIStore((state) => state.sidebar)
export const useTheme = () => useUIStore((state) => state.theme)
export const useIsMobile = () => useUIStore((state) => state.isMobile)
export const useScreenSize = () => useUIStore((state) => state.screenSize)

/**
 * Helper hooks for common UI operations
 */
export const useUIHelpers = () => {
  const store = useUIStore()

  return {
    // Toast helpers
    showSuccess: (message: string, title?: string) => {
      store.addToast({ type: "success", message, title })
    },
    showError: (message: string, title?: string) => {
      store.addToast({ type: "error", message, title })
    },
    showWarning: (message: string, title?: string) => {
      store.addToast({ type: "warning", message, title })
    },
    showInfo: (message: string, title?: string) => {
      store.addToast({ type: "info", message, title })
    },

    // Loading helpers
    startGlobalLoading: (message?: string) => {
      store.setGlobalLoading(true, message)
    },
    stopGlobalLoading: () => {
      store.setGlobalLoading(false)
    },
    startPageLoading: (message?: string) => {
      store.setPageLoading(true, message)
    },
    stopPageLoading: () => {
      store.setPageLoading(false)
    },

    // Modal helpers
    showModal: (content: React.ReactNode, title?: string, size?: ModalState["size"]) => {
      store.openModal({ content, title, size })
    },
    hideModal: () => {
      store.closeModal()
    },

    // Theme helpers
    isDarkMode:
      store.theme === "dark" ||
      (store.theme === "system" &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches),

    isLightMode:
      store.theme === "light" ||
      (store.theme === "system" &&
        typeof window !== "undefined" &&
        !window.matchMedia("(prefers-color-scheme: dark)").matches),
  }
}
