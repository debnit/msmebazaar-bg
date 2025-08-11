"use client"

import type React from "react"

import { useEffect, useRef, useCallback } from "react"
import { useAuth } from "@/hooks/use-auth"
import { usePathname, useSearchParams } from "next/navigation"
import type {
  AnalyticsEvent,
  UserSession,
  PageViewEvent,
  ClickEvent,
  PurchaseEvent,
  SearchEvent,
  FeatureUsageEvent,
  CustomEvent,
} from "@/types/analytics"

interface AnalyticsConfig {
  apiEndpoint?: string
  batchSize?: number
  flushInterval?: number
  enableDebug?: boolean
  enableAutoTracking?: boolean
  trackPageViews?: boolean
  trackClicks?: boolean
  trackScrollDepth?: boolean
  trackTimeOnPage?: boolean
}

interface AnalyticsTrackerProps {
  config?: AnalyticsConfig
  children?: React.ReactNode
}

const EventTypeEnum = {
  CLICK: "click",
  PAGE_VIEW: "page_view",
  PURCHASE: "purchase",
  SEARCH: "search",
  FEATURE_USAGE: "feature_usage",
  CUSTOM: "custom",
} as const

class AnalyticsService {
  private events: AnalyticsEvent[] = []
  private session: UserSession | null = null
  private config: Required<AnalyticsConfig>
  private flushTimer: NodeJS.Timeout | null = null
  private pageStartTime: number = Date.now()
  private maxScrollDepth = 0
  private isVisible = true

  constructor(config: AnalyticsConfig = {}) {
    this.config = {
      apiEndpoint: config.apiEndpoint || "/api/analytics/events",
      batchSize: config.batchSize || 10,
      flushInterval: config.flushInterval || 5000,
      enableDebug: config.enableDebug || false,
      enableAutoTracking: config.enableAutoTracking ?? true,
      trackPageViews: config.trackPageViews ?? true,
      trackClicks: config.trackClicks ?? true,
      trackScrollDepth: config.trackScrollDepth ?? true,
      trackTimeOnPage: config.trackTimeOnPage ?? true,
    }

    this.initializeSession()
    this.setupAutoTracking()
    this.startFlushTimer()
  }

  private initializeSession() {
    const sessionId = this.generateSessionId()
    this.session = {
      sessionId,
      userId: null,
      startTime: new Date(),
      lastActivity: new Date(),
      pageViews: 0,
      events: 0,
      device: this.getDeviceInfo(),
      browser: this.getBrowserInfo(),
      location: this.getLocationInfo(),
      referrer: document.referrer || null,
      utmSource: this.getUtmParameter("utm_source"),
      utmMedium: this.getUtmParameter("utm_medium"),
      utmCampaign: this.getUtmParameter("utm_campaign"),
      isActive: true,
    }
  }

  private setupAutoTracking() {
    if (!this.config.enableAutoTracking) return

    // Track page visibility
    document.addEventListener("visibilitychange", this.handleVisibilityChange)

    // Track scroll depth
    if (this.config.trackScrollDepth) {
      window.addEventListener("scroll", this.handleScroll, { passive: true })
    }

    // Track clicks
    if (this.config.trackClicks) {
      document.addEventListener("click", this.handleClick, true)
    }

    // Track page unload
    window.addEventListener("beforeunload", this.handlePageUnload)
  }

  private handleVisibilityChange = () => {
    this.isVisible = !document.hidden
    if (this.session) {
      this.session.isActive = this.isVisible
      this.session.lastActivity = new Date()
    }
  }

  private handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollDepth = Math.round(((scrollTop + windowHeight) / documentHeight) * 100)

    if (scrollDepth > this.maxScrollDepth) {
      this.maxScrollDepth = scrollDepth
    }
  }

  private handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target) return

    const clickEvent: ClickEvent = {
      id: this.generateEventId(),
      type: EventTypeEnum.CLICK,
      timestamp: new Date(),
      sessionId: this.session?.sessionId || "",
      userId: this.session?.userId || null,
      properties: {
        elementType: target.tagName.toLowerCase(),
        elementId: target.id || null,
        elementClass: target.className || null,
        elementText: target.textContent?.slice(0, 100) || null,
        href: target.getAttribute("href") || null,
        position: {
          x: event.clientX,
          y: event.clientY,
        },
        page: window.location.pathname,
        url: window.location.href,
      },
    }

    this.track(clickEvent)
  }

  private handlePageUnload = () => {
    if (this.config.trackTimeOnPage) {
      const timeOnPage = Date.now() - this.pageStartTime
      this.trackCustomEvent("page_unload", {
        timeOnPage,
        scrollDepth: this.maxScrollDepth,
        page: window.location.pathname,
      })
    }

    this.flush(true)
  }

  public setUser(userId: string, properties?: Record<string, any>) {
    if (this.session) {
      this.session.userId = userId
      this.session.userProperties = properties
    }

    this.trackCustomEvent("user_identified", {
      userId,
      ...properties,
    })
  }

  public trackPageView(path?: string, title?: string) {
    if (!this.config.trackPageViews) return

    const pageViewEvent: PageViewEvent = {
      id: this.generateEventId(),
      type: EventTypeEnum.PAGE_VIEW,
      timestamp: new Date(),
      sessionId: this.session?.sessionId || "",
      userId: this.session?.userId || null,
      properties: {
        page: path || window.location.pathname,
        title: title || document.title,
        url: window.location.href,
        referrer: document.referrer || null,
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    }

    if (this.session) {
      this.session.pageViews++
      this.session.lastActivity = new Date()
    }

    this.pageStartTime = Date.now()
    this.maxScrollDepth = 0

    this.track(pageViewEvent)
  }

  public trackPurchase(orderId: string, amount: number, currency = "INR", items?: any[]) {
    const purchaseEvent: PurchaseEvent = {
      id: this.generateEventId(),
      type: EventTypeEnum.PURCHASE,
      timestamp: new Date(),
      sessionId: this.session?.sessionId || "",
      userId: this.session?.userId || null,
      properties: {
        orderId,
        amount,
        currency,
        items: items || [],
        page: window.location.pathname,
        paymentMethod: null,
        couponCode: null,
      },
    }

    this.track(purchaseEvent)
  }

  public trackSearch(query: string, category?: string, results?: number) {
    const searchEvent: SearchEvent = {
      id: this.generateEventId(),
      type: EventTypeEnum.SEARCH,
      timestamp: new Date(),
      sessionId: this.session?.sessionId || "",
      userId: this.session?.userId || null,
      properties: {
        query,
        category: category || null,
        results: results || null,
        page: window.location.pathname,
      },
    }

    this.track(searchEvent)
  }

  public trackFeatureUsage(feature: string, action: string, metadata?: Record<string, any>) {
    const featureEvent: FeatureUsageEvent = {
      id: this.generateEventId(),
      type: EventTypeEnum.FEATURE_USAGE,
      timestamp: new Date(),
      sessionId: this.session?.sessionId || "",
      userId: this.session?.userId || null,
      properties: {
        feature,
        action,
        metadata: metadata || {},
        page: window.location.pathname,
      },
    }

    this.track(featureEvent)
  }

  public trackCustomEvent(eventName: string, properties?: Record<string, any>) {
    const customEvent: CustomEvent = {
      id: this.generateEventId(),
      type: EventTypeEnum.CUSTOM,
      timestamp: new Date(),
      sessionId: this.session?.sessionId || "",
      userId: this.session?.userId || null,
      properties: {
        eventName,
        ...properties,
        page: window.location.pathname,
      },
    }

    this.track(customEvent)
  }

  private track(event: AnalyticsEvent) {
    if (this.config.enableDebug) {
      console.log("Analytics Event:", event)
    }

    this.events.push(event)

    if (this.session) {
      this.session.events++
      this.session.lastActivity = new Date()
    }

    if (this.events.length >= this.config.batchSize) {
      this.flush()
    }
  }

  private async flush(force = false) {
    if (this.events.length === 0) return

    const eventsToSend = [...this.events]
    this.events = []

    try {
      const response = await fetch(this.config.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          events: eventsToSend,
          session: this.session,
        }),
        keepalive: force,
      })

      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.status}`)
      }

      if (this.config.enableDebug) {
        console.log(`Sent ${eventsToSend.length} analytics events`)
      }
    } catch (error) {
      console.error("Failed to send analytics events:", error)
      // Re-add events to queue for retry
      this.events.unshift(...eventsToSend)
    }
  }

  private startFlushTimer() {
    this.flushTimer = setInterval(() => {
      this.flush()
    }, this.config.flushInterval)
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateSessionId(): string {
    return `ses_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getDeviceInfo() {
    const ua = navigator.userAgent
    return {
      type: /Mobile|Android|iPhone|iPad/.test(ua) ? "mobile" : "desktop",
      os: this.getOS(),
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      colorDepth: screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
    }
  }

  private getBrowserInfo() {
    const ua = navigator.userAgent
    let browser = "Unknown"

    if (ua.includes("Chrome")) browser = "Chrome"
    else if (ua.includes("Firefox")) browser = "Firefox"
    else if (ua.includes("Safari")) browser = "Safari"
    else if (ua.includes("Edge")) browser = "Edge"

    return {
      name: browser,
      version: this.getBrowserVersion(),
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack === "1",
    }
  }

  private getLocationInfo() {
    return {
      href: window.location.href,
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      host: window.location.host,
      protocol: window.location.protocol,
    }
  }

  private getOS(): string {
    const ua = navigator.userAgent
    if (ua.includes("Windows")) return "Windows"
    if (ua.includes("Mac")) return "macOS"
    if (ua.includes("Linux")) return "Linux"
    if (ua.includes("Android")) return "Android"
    if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS"
    return "Unknown"
  }

  private getBrowserVersion(): string {
    const ua = navigator.userAgent
    const match = ua.match(/(Chrome|Firefox|Safari|Edge)\/(\d+)/i)
    return match ? match[2] : "Unknown"
  }

  private getUtmParameter(param: string): string | null {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(param)
  }

  public destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }

    document.removeEventListener("visibilitychange", this.handleVisibilityChange)
    window.removeEventListener("scroll", this.handleScroll)
    document.removeEventListener("click", this.handleClick)
    window.removeEventListener("beforeunload", this.handlePageUnload)

    this.flush(true)
  }
}

// Global analytics instance
let analyticsInstance: AnalyticsService | null = null

export function AnalyticsTracker({ config, children }: AnalyticsTrackerProps) {
  const { user } = useAuth()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const analyticsRef = useRef<AnalyticsService | null>(null)

  // Initialize analytics service
  useEffect(() => {
    if (!analyticsRef.current) {
      analyticsRef.current = new AnalyticsService(config)
      analyticsInstance = analyticsRef.current
    }

    return () => {
      if (analyticsRef.current) {
        analyticsRef.current.destroy()
        analyticsRef.current = null
        analyticsInstance = null
      }
    }
  }, [config])

  // Track user identification
  useEffect(() => {
    if (user && analyticsRef.current) {
      analyticsRef.current.setUser(user.id, {
        email: user.email,
        name: user.name,
        role: user.role,
        businessId: user.businessId,
        isProUser: user.isProUser,
      })
    }
  }, [user])

  // Track page views
  useEffect(() => {
    if (analyticsRef.current) {
      const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")
      analyticsRef.current.trackPageView(url)
    }
  }, [pathname, searchParams])

  return <>{children}</>
}

// Hook for using analytics in components
export function useAnalytics() {
  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    if (analyticsInstance) {
      analyticsInstance.trackCustomEvent(eventName, properties)
    }
  }, [])

  const trackPageView = useCallback((path?: string, title?: string) => {
    if (analyticsInstance) {
      analyticsInstance.trackPageView(path, title)
    }
  }, [])

  const trackPurchase = useCallback((orderId: string, amount: number, currency?: string, items?: any[]) => {
    if (analyticsInstance) {
      analyticsInstance.trackPurchase(orderId, amount, currency, items)
    }
  }, [])

  const trackSearch = useCallback((query: string, category?: string, results?: number) => {
    if (analyticsInstance) {
      analyticsInstance.trackSearch(query, category, results)
    }
  }, [])

  const trackFeatureUsage = useCallback((feature: string, action: string, metadata?: Record<string, any>) => {
    if (analyticsInstance) {
      analyticsInstance.trackFeatureUsage(feature, action, metadata)
    }
  }, [])

  return {
    trackEvent,
    trackPageView,
    trackPurchase,
    trackSearch,
    trackFeatureUsage,
  }
}

export default AnalyticsTracker
