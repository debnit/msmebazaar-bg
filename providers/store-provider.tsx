"use client"

import { createContext, useContext } from "react"
import { useStore } from "@/store"
import type { StoreApi } from "zustand"
import type { AppStore } from "@/store/types"

const StoreContext = createContext<StoreApi<AppStore> | undefined>(undefined)

interface StoreProviderProps {
  children: React.ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  const store = useStore()

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStoreContext() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStoreContext must be used within a StoreProvider")
  }
  return context
}