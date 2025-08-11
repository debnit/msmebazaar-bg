// Analytics and tracking types for MSMEBazaar platform

// Base event tracking
export interface BaseEvent {
  id: string
  timestamp: Date
  userId?: string
  sessionId: string
  deviceId: string
  userAgent: string
  ip: string
  location?: {
    country: string
    state: string
    city: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
}

// Event types
export enum EventType {
  PAGE_VIEW = "page_view",
  CLICK = "click",
  FORM_SUBMIT = "form_submit",
  PURCHASE = "purchase",
  SIGNUP = "signup",
  LOGIN = "login",
  LOGOUT = "logout",
  SEARCH = "search",
  FEATURE_USE = "feature_use",
  ERROR = "error",
  CUSTOM = "custom",
}

// Specific event interfaces
export interface PageViewEvent extends BaseEvent {
  type: EventType.PAGE_VIEW
  data: {
    path: string
    title: string
    referrer?: string
    duration?: number
    scrollDepth?: number
  }
}

export interface ClickEvent extends BaseEvent {
  type: EventType.CLICK
  data: {
    element: string
    text?: string
    href?: string
    position: {
      x: number
      y: number
    }
  }
}

export interface PurchaseEvent extends BaseEvent {
  type: EventType.PURCHASE
  data: {
    orderId: string
    amount: number
    currency: string
    items: Array<{
      id: string
      name: string
      category: string
      price: number
      quantity: number
    }>
    paymentMethod: string
  }
}

export interface SearchEvent extends BaseEvent {
  type: EventType.SEARCH
  data: {
    query: string
    category?: string
    resultsCount: number
    filters?: Record<string, any>
  }
}

export interface FeatureUseEvent extends BaseEvent {
  type: EventType.FEATURE_USE
  data: {
    featureId: string
    featureName: string
    action: string
    context?: Record<string, any>
  }
}

export type AnalyticsEvent = PageViewEvent | ClickEvent | PurchaseEvent | SearchEvent | FeatureUseEvent

// User session tracking
export interface UserSession {
  id: string
  userId?: string
  startTime: Date
  endTime?: Date
  duration?: number
  pageViews: number
  events: number
  device: {
    type: "desktop" | "mobile" | "tablet"
    os: string
    browser: string
    screenResolution: string
  }
  location: {
    country: string
    state: string
    city: string
  }
  referrer?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  isNewUser: boolean
  bounced: boolean
}

// Business analytics metrics
export interface BusinessMetrics {
  revenue: {
    total: number
    recurring: number
    oneTime: number
    growth: number
    currency: string
  }
  customers: {
    total: number
    new: number
    returning: number
    churn: number
    ltv: number
  }
  orders: {
    total: number
    completed: number
    pending: number
    cancelled: number
    averageValue: number
  }
  traffic: {
    visitors: number
    pageViews: number
    sessions: number
    bounceRate: number
    avgSessionDuration: number
  }
  conversion: {
    signupRate: number
    purchaseRate: number
    subscriptionRate: number
  }
}

// Feature usage analytics
export interface FeatureUsage {
  featureId: string
  featureName: string
  category: string
  usage: {
    totalUsers: number
    activeUsers: number
    newUsers: number
    sessions: number
    events: number
  }
  adoption: {
    rate: number
    trend: "up" | "down" | "stable"
    timeToAdopt: number
  }
  retention: {
    day1: number
    day7: number
    day30: number
  }
  satisfaction: {
    rating: number
    feedback: Array<{
      rating: number
      comment: string
      userId: string
      timestamp: Date
    }>
  }
}

// Funnel analytics
export interface FunnelStep {
  id: string
  name: string
  description: string
  order: number
  event: EventType
  conditions?: Record<string, any>
}

export interface FunnelAnalysis {
  id: string
  name: string
  steps: FunnelStep[]
  results: {
    totalUsers: number
    stepResults: Array<{
      stepId: string
      users: number
      conversionRate: number
      dropoffRate: number
      avgTimeToNext?: number
    }>
    overallConversion: number
  }
  timeRange: {
    start: Date
    end: Date
  }
}

// Cohort analysis
export interface CohortData {
  cohortId: string
  cohortDate: Date
  cohortSize: number
  retentionData: Array<{
    period: number
    users: number
    retentionRate: number
  }>
  revenueData?: Array<{
    period: number
    revenue: number
    avgRevenuePerUser: number
  }>
}

// A/B testing
export interface Experiment {
  id: string
  name: string
  description: string
  status: "draft" | "running" | "paused" | "completed"
  startDate: Date
  endDate?: Date
  targetAudience: {
    percentage: number
    criteria?: Record<string, any>
  }
  variants: Array<{
    id: string
    name: string
    description: string
    allocation: number
    config: Record<string, any>
  }>
  metrics: Array<{
    name: string
    type: "conversion" | "revenue" | "engagement"
    goal: "increase" | "decrease"
  }>
  results?: {
    participants: number
    significance: number
    winner?: string
    variantResults: Array<{
      variantId: string
      participants: number
      conversions: number
      conversionRate: number
      revenue?: number
      confidence: number
    }>
  }
}

// Real-time analytics
export interface RealTimeMetrics {
  timestamp: Date
  activeUsers: number
  pageViews: number
  events: number
  topPages: Array<{
    path: string
    views: number
  }>
  topEvents: Array<{
    type: string
    count: number
  }>
  geography: Array<{
    country: string
    users: number
  }>
  devices: {
    desktop: number
    mobile: number
    tablet: number
  }
  referrers: Array<{
    source: string
    users: number
  }>
}

// Dashboard configuration
export interface DashboardWidget {
  id: string
  type: "metric" | "chart" | "table" | "funnel" | "heatmap"
  title: string
  description?: string
  position: {
    x: number
    y: number
    width: number
    height: number
  }
  config: {
    metric?: string
    chartType?: "line" | "bar" | "pie" | "area"
    timeRange?: string
    filters?: Record<string, any>
    groupBy?: string
  }
  refreshInterval?: number
}

export interface Dashboard {
  id: string
  name: string
  description?: string
  isPublic: boolean
  widgets: DashboardWidget[]
  filters: {
    dateRange: {
      start: Date
      end: Date
    }
    segments?: Record<string, any>
  }
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

// Query builder
export interface AnalyticsQuery {
  id: string
  name: string
  description?: string
  select: string[]
  from: string
  where?: Array<{
    field: string
    operator: "eq" | "ne" | "gt" | "lt" | "gte" | "lte" | "in" | "nin" | "contains"
    value: any
  }>
  groupBy?: string[]
  orderBy?: Array<{
    field: string
    direction: "asc" | "desc"
  }>
  limit?: number
  timeRange?: {
    start: Date
    end: Date
  }
}

export interface QueryResult {
  query: AnalyticsQuery
  data: Record<string, any>[]
  totalRows: number
  executionTime: number
  cached: boolean
  generatedAt: Date
}

// Analytics configuration
export interface AnalyticsConfig {
  trackingEnabled: boolean
  anonymizeIp: boolean
  cookieConsent: boolean
  dataRetentionDays: number
  samplingRate: number
  excludedPaths: string[]
  customDimensions: Array<{
    name: string
    key: string
    type: "string" | "number" | "boolean"
  }>
  goals: Array<{
    id: string
    name: string
    type: "url" | "event" | "duration"
    value: string | number
  }>
}

// Export types for external use
export type {
  BaseEvent,
  AnalyticsEvent,
  UserSession,
  BusinessMetrics,
  FeatureUsage,
  FunnelAnalysis,
  CohortData,
  Experiment,
  RealTimeMetrics,
  Dashboard,
  DashboardWidget,
  AnalyticsQuery,
  QueryResult,
  AnalyticsConfig,
}
