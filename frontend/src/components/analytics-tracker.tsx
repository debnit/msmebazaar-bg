"use client"

import type React from "react"

import { useEffect, useRef, useCallback } from "react"
import { useAuth } from "@/frontend/src/hooks/use-auth"
import { usePathname, useSearchParams } from "next/navigation"
import type {
  AnalyticsEvent,
  PageViewEvent,
  ClickEvent,
  PurchaseEvent,
  SearchEvent,
  FeatureUsageEvent,
  UserSession,
  EventBatch,
} from "@/types/analytics"

interface AnalyticsConfig {
  apiEndpoint?: string
  batchSize?: number
  flushInterval?: number
  enableAutoTracking?: boolean
  enableScrollTracking?: boolean
  enableClickTracking?: boolean
  debug?: boolean
}

class AnalyticsService {
  private config: Required<AnalyticsConfig>
  private eventQueue: AnalyticsEvent[] = []
  private sessionId: string
  private sessionStartTime: number
  private lastActivityTime: number
  private flushTimer: NodeJS.Timeout | null = null
  private isOnline = true

  constructor(config: AnalyticsConfig = {}) {
    this.config = {
      apiEndpoint: config.apiEndpoint || "/api/analytics",
      batchSize: config.batchSize || 10,
      flushInterval: config.flushInterval || 5000,
      enableAutoTracking: config.enableAutoTracking ?? true,
      enableScrollTracking: config.enableScrollTracking ?? true,
      enableClickTracking: config.enableClickTracking ?? true,
      debug: config.debug ?? false,
    }

    this.sessionId = this.generateSessionId()
    this.sessionStartTime = Date.now()
    this.lastActivityTime = Date.now()

    this.setupEventListeners()
    this.startFlushTimer()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private setupEventListeners() {
    if (typeof window === "undefined") return

    // Online/offline status
    window.addEventListener("online", () => {
      this.isOnline = true
      this.flush()
    })
    window.addEventListener("offline", () => {
      this.isOnline = false
    })

    // Page visibility
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.flush()
      }
    })

    // Before unload
    window.addEventListener("beforeunload", () => {
      this.flush(true)
    })

    // Auto-tracking setup
    if (this.config.enableClickTracking) {
      this.setupClickTracking()
    }

    if (this.config.enableScrollTracking) {
      this.setupScrollTracking()
    }
  }

  private setupClickTracking() {
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement
      if (!target) return

      // Track button clicks
      if (target.tagName === "BUTTON" || target.closest("button")) {
        const button = target.tagName === "BUTTON" ? target : target.closest("button")!
        this.trackClick({
          elementType: "button",
          elementText: button.textContent?.trim() || "",
          elementId: button.id || undefined,
          elementClass: button.className || undefined,
        })
      }

      // Track link clicks
      if (target.tagName === "A" || target.closest("a")) {
        const link = target.tagName === "A" ? (target as HTMLAnchorElement) : target.closest("a")!
        this.trackClick({
          elementType: "link",
          elementText: link.textContent?.trim() || "",
          elementId: link.id || undefined,
          elementClass: link.className || undefined,
          href: link.href,
        })
      }
    })
  }

  private setupScrollTracking() {
    let maxScrollDepth = 0
    let scrollTimer: NodeJS.Timeout

    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollDepth = Math.round(((scrollTop + windowHeight) / documentHeight) * 100)

      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth

        // Track milestone scroll depths
        const milestones = [25, 50, 75, 90, 100]
        const milestone = milestones.find((m) => maxScrollDepth >= m && maxScrollDepth < m + 5)

        if (milestone) {
          this.track({
            type: "scroll_depth",
            properties: {
              depth: milestone,
              page: window.location.pathname,
            },
            timestamp: Date.now(),
          })
        }
      }
    }

    window.addEventListener("scroll", () => {
      clearTimeout(scrollTimer)
      scrollTimer = setTimeout(trackScrollDepth, 100)
    })
  }

  private startFlushTimer() {
    this.flushTimer = setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.flush()
      }
    }, this.config.flushInterval)
  }

  public track(event: Omit<AnalyticsEvent, "id" | "sessionId">): void {
    const fullEvent: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      ...event,
    }

    this.eventQueue.push(fullEvent)
    this.lastActivityTime = Date.now()

    if (this.config.debug) {
      console.log("Analytics Event:", fullEvent)
    }

    // Auto-flush if batch size reached
    if (this.eventQueue.length >= this.config.batchSize) {
      this.flush()
    }
  }

  public trackPageView(data: Omit<PageViewEvent, "type" | "timestamp">): void {
    this.track({
      type: "page_view",
      properties: {
        ...data,
        sessionDuration: Date.now() - this.sessionStartTime,
      },
    })
  }

  public trackClick(data: Omit<ClickEvent["properties"], "timestamp">): void {
    this.track({
      type: "click",
      properties: {
        ...data,
        page: window.location.pathname,
      },
    })
  }

  public trackPurchase(data: Omit<PurchaseEvent["properties"], "timestamp">): void {
    this.track({
      type: "purchase",
      properties: data,
    })
  }

  public trackSearch(data: Omit<SearchEvent["properties"], "timestamp">): void {
    this.track({
      type: "search",
      properties: data,
    })
  }

  public trackFeatureUsage(data: Omit<FeatureUsageEvent["properties"], "timestamp">): void {
    this.track({
      type: "feature_usage",
      properties: data,
    })
  }

  public async flush(immediate = false): Promise<void> {
    if (this.eventQueue.length === 0) return
    if (!this.isOnline && !immediate) return

    const events = [...this.eventQueue]
    this.eventQueue = []

    const batch: EventBatch = {
      id: `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      events,
      timestamp: Date.now(),
      sessionInfo: this.getSessionInfo(),
    }

    try {
      const response = await fetch(this.config.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(batch),
        keepalive: immediate,
      })

      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.status}`)
      }

      if (this.config.debug) {
        console.log("Analytics batch sent:", batch)
      }
    } catch (error) {
      console.error("Failed to send analytics batch:", error)

      // Re-queue events if not immediate flush
      if (!immediate) {
        this.eventQueue.unshift(...events)
      }
    }
  }

  private getSessionInfo(): UserSession {
    return {
      id: this.sessionId,
      userId: undefined, // Will be set by the component
      startTime: this.sessionStartTime,
      lastActivityTime: this.lastActivityTime,
      duration: Date.now() - this.sessionStartTime,
      pageViews: this.eventQueue.filter((e) => e.type === "page_view").length,
      events: this.eventQueue.length,
      device: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      location: {
        url: window.location.href,
        pathname: window.location.pathname,
        search: window.location.search,
        referrer: document.referrer,
      },
    }
  }

  public destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }
    this.flush(true)
  }
}

// Global analytics instance
let analyticsInstance: AnalyticsService | null = null

export function getAnalytics(config?: AnalyticsConfig): AnalyticsService {
  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsService(config)
  }
  return analyticsInstance
}

interface AnalyticsTrackerProps {
  config?: AnalyticsConfig
  children: React.ReactNode
}

export function AnalyticsTracker({ config, children }: AnalyticsTrackerProps) {
  const { user } = useAuth()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const analyticsRef = useRef<AnalyticsService | null>(null)
  const previousPathnameRef = useRef<string>("")

  // Initialize analytics
  useEffect(() => {
    analyticsRef.current = getAnalytics(config)

    return () => {
      analyticsRef.current?.destroy()
    }
  }, [config])

  // Track page views
  useEffect(() => {
    if (!analyticsRef.current) return

    const currentPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")

    // Don't track initial page load or same page
    if (previousPathnameRef.current && previousPathnameRef.current !== currentPath) {
      analyticsRef.current.trackPageView({
        page: pathname,
        title: document.title,
        url: window.location.href,
        referrer: document.referrer,
        search: searchParams?.toString() || "",
        userId: user?.id,
      })
    }

    previousPathnameRef.current = currentPath
  }, [pathname, searchParams, user?.id])

  // Track user changes
  useEffect(() => {
    if (!analyticsRef.current || !user) return

    analyticsRef.current.track({
      type: "user_identify",
      properties: {
        userId: user.id,
        email: user.email,
        role: user.role,
        businessId: user.businessId,
        isProUser: user.isProUser,
      },
    })
  }, [user])

  return <>{children}</>
}

// Hook for using analytics in components
export function useAnalytics() {
  const analytics = useRef<AnalyticsService | null>(null)

  useEffect(() => {
    analytics.current = getAnalytics()
  }, [])

  const trackEvent = useCallback((event: Omit<AnalyticsEvent, "id" | "sessionId">) => {
    analytics.current?.track(event)
  }, [])

  const trackPageView = useCallback((data: Omit<PageViewEvent, "type" | "timestamp">) => {
    analytics.current?.trackPageView(data)
  }, [])

  const trackClick = useCallback((data: Omit<ClickEvent["properties"], "timestamp">) => {
    analytics.current?.trackClick(data)
  }, [])

  const trackPurchase = useCallback((data: Omit<PurchaseEvent["properties"], "timestamp">) => {
    analytics.current?.trackPurchase(data)
  }, [])

  const trackSearch = useCallback((data: Omit<SearchEvent["properties"], "timestamp">) => {
    analytics.current?.trackSearch(data)
  }, [])

  const trackFeatureUsage = useCallback((data: Omit<FeatureUsageEvent["properties"], "timestamp">) => {
    analytics.current?.trackFeatureUsage(data)
  }, [])

  return {
    trackEvent,
    trackPageView,
    trackClick,
    trackPurchase,
    trackSearch,
    trackFeatureUsage,
  }
}

export default AnalyticsTracker
