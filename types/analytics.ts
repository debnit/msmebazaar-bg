// Analytics and tracking types for MSMEBazaar

export enum EventType {
  PAGE_VIEW = "page_view",
  CLICK = "click",
  FORM_SUBMIT = "form_submit",
  PURCHASE = "purchase",
  SIGN_UP = "sign_up",
  LOGIN = "login",
  LOGOUT = "logout",
  SEARCH = "search",
  PRODUCT_VIEW = "product_view",
  ADD_TO_CART = "add_to_cart",
  REMOVE_FROM_CART = "remove_from_cart",
  CHECKOUT_START = "checkout_start",
  CHECKOUT_COMPLETE = "checkout_complete",
  PAYMENT_SUCCESS = "payment_success",
  PAYMENT_FAILED = "payment_failed",
  SUBSCRIPTION_START = "subscription_start",
  SUBSCRIPTION_CANCEL = "subscription_cancel",
  FEATURE_USAGE = "feature_usage",
  ERROR = "error",
  CUSTOM = "custom",
}

export enum MetricType {
  COUNT = "count",
  SUM = "sum",
  AVERAGE = "average",
  PERCENTAGE = "percentage",
  RATE = "rate",
  DURATION = "duration",
  UNIQUE = "unique",
}

export enum TimeGranularity {
  MINUTE = "minute",
  HOUR = "hour",
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  QUARTER = "quarter",
  YEAR = "year",
}

export enum DeviceType {
  DESKTOP = "desktop",
  MOBILE = "mobile",
  TABLET = "tablet",
  UNKNOWN = "unknown",
}

export enum TrafficSource {
  DIRECT = "direct",
  ORGANIC_SEARCH = "organic_search",
  PAID_SEARCH = "paid_search",
  SOCIAL = "social",
  EMAIL = "email",
  REFERRAL = "referral",
  DISPLAY = "display",
  AFFILIATE = "affiliate",
  OTHER = "other",
}

// Core Analytics Event
export interface AnalyticsEvent {
  id: string
  eventType: EventType
  userId?: string
  sessionId: string
  timestamp: Date

  // Event Properties
  properties: Record<string, any>

  // User Properties
  userProperties?: {
    userId?: string
    email?: string
    name?: string
    role?: string
    isPro?: boolean
    businessId?: string
    businessType?: string
    industryType?: string
    location?: {
      country: string
      state: string
      city: string
    }
  }

  // Session Properties
  sessionProperties: {
    sessionId: string
    deviceType: DeviceType
    browser: string
    browserVersion: string
    os: string
    osVersion: string
    screenResolution: string
    language: string
    timezone: string
    userAgent: string
  }

  // Page Properties
  pageProperties?: {
    url: string
    path: string
    title: string
    referrer?: string
    searchParams?: Record<string, string>
  }

  // Traffic Properties
  trafficProperties?: {
    source: TrafficSource
    medium?: string
    campaign?: string
    term?: string
    content?: string
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
    utmTerm?: string
    utmContent?: string
  }

  // Custom Properties
  customProperties?: Record<string, any>
}

// User Session Tracking
export interface UserSession {
  id: string
  userId?: string
  startTime: Date
  endTime?: Date
  duration?: number
  pageViews: number
  events: number
  bounced: boolean
  converted: boolean

  // Device & Browser Info
  deviceType: DeviceType
  browser: string
  browserVersion: string
  os: string
  osVersion: string
  screenResolution: string

  // Location Info
  ipAddress: string
  country: string
  state: string
  city: string
  timezone: string

  // Traffic Info
  trafficSource: TrafficSource
  referrer?: string
  landingPage: string
  exitPage?: string

  // Engagement Metrics
  scrollDepth?: number
  timeOnPage?: Record<string, number>
  clickCount: number
  formSubmissions: number

  // Conversion Info
  goalCompletions?: string[]
  revenue?: number

  // Custom Data
  customData?: Record<string, any>
}

// Page Analytics
export interface PageAnalytics {
  url: string
  path: string
  title: string

  // Traffic Metrics
  pageViews: number
  uniquePageViews: number
  sessions: number
  users: number
  newUsers: number

  // Engagement Metrics
  averageTimeOnPage: number
  bounceRate: number
  exitRate: number
  averageScrollDepth: number

  // Conversion Metrics
  conversions: number
  conversionRate: number
  goalCompletions: Record<string, number>

  // Performance Metrics
  averageLoadTime: number

  // Time Series Data
  timeSeries: Array<{
    timestamp: Date
    pageViews: number
    users: number
    bounceRate: number
    averageTimeOnPage: number
  }>

  // Top Referrers
  topReferrers: Array<{
    referrer: string
    sessions: number
    percentage: number
  }>

  // Exit Pages
  nextPages: Array<{
    page: string
    sessions: number
    percentage: number
  }>
}

// Business Analytics
export interface BusinessAnalytics {
  businessId: string
  period: {
    start: Date
    end: Date
  }

  // Revenue Metrics
  revenue: {
    total: number
    recurring: number
    oneTime: number
    growth: number
    trend: Array<{
      date: Date
      value: number
    }>
  }

  // Customer Metrics
  customers: {
    total: number
    new: number
    returning: number
    churnRate: number
    ltv: number // Lifetime Value
    cac: number // Customer Acquisition Cost
    growth: number
  }

  // Product Metrics
  products: {
    totalViews: number
    totalSales: number
    conversionRate: number
    topProducts: Array<{
      productId: string
      name: string
      views: number
      sales: number
      revenue: number
    }>
  }

  // Order Metrics
  orders: {
    total: number
    completed: number
    cancelled: number
    averageOrderValue: number
    fulfillmentRate: number
  }

  // Marketing Metrics
  marketing: {
    totalSpend: number
    roas: number // Return on Ad Spend
    cpm: number // Cost per Mille
    cpc: number // Cost per Click
    ctr: number // Click Through Rate
    conversionRate: number
  }

  // Geographic Distribution
  geography: Array<{
    country: string
    state: string
    city: string
    users: number
    revenue: number
    percentage: number
  }>

  // Device Distribution
  devices: Array<{
    deviceType: DeviceType
    users: number
    sessions: number
    revenue: number
    percentage: number
  }>

  // Traffic Sources
  trafficSources: Array<{
    source: TrafficSource
    users: number
    sessions: number
    revenue: number
    conversionRate: number
    percentage: number
  }>
}

// Feature Usage Analytics
export interface FeatureUsageAnalytics {
  featureId: string
  featureName: string
  period: {
    start: Date
    end: Date
  }

  // Usage Metrics
  totalUsers: number
  activeUsers: number
  newUsers: number
  returningUsers: number
  usageCount: number
  averageUsagePerUser: number

  // Engagement Metrics
  adoptionRate: number
  retentionRate: number
  stickiness: number // DAU/MAU ratio

  // User Segments
  userSegments: Array<{
    segment: string
    users: number
    usageCount: number
    percentage: number
  }>

  // Time Series
  timeSeries: Array<{
    date: Date
    users: number
    usageCount: number
  }>

  // Conversion Impact
  conversionImpact: {
    usersWhoConverted: number
    conversionRate: number
    revenueImpact: number
  }
}

// Funnel Analytics
export interface FunnelStep {
  stepId: string
  stepName: string
  stepOrder: number
  users: number
  conversionRate: number
  dropOffRate: number
  averageTimeToNext?: number
}

export interface FunnelAnalytics {
  funnelId: string
  funnelName: string
  period: {
    start: Date
    end: Date
  }

  steps: FunnelStep[]

  // Overall Metrics
  totalUsers: number
  completedUsers: number
  overallConversionRate: number
  averageTimeToComplete: number

  // Segment Analysis
  segmentAnalysis: Array<{
    segment: string
    users: number
    conversionRate: number
    steps: Array<{
      stepId: string
      users: number
      conversionRate: number
    }>
  }>
}

// Cohort Analysis
export interface CohortAnalytics {
  cohortType: "registration" | "first_purchase" | "subscription" | "custom"
  period: {
    start: Date
    end: Date
  }

  cohorts: Array<{
    cohortDate: Date
    cohortSize: number
    retentionRates: Array<{
      period: number
      users: number
      retentionRate: number
    }>
  }>

  // Average Retention
  averageRetention: Array<{
    period: number
    retentionRate: number
  }>
}

// A/B Test Analytics
export interface ABTestAnalytics {
  testId: string
  testName: string
  status: "draft" | "running" | "completed" | "paused"

  variants: Array<{
    variantId: string
    variantName: string
    trafficAllocation: number
    users: number
    conversions: number
    conversionRate: number
    confidence: number
    significance: number
  }>

  // Test Results
  winningVariant?: string
  statisticalSignificance: number
  confidenceLevel: number

  // Metrics
  primaryMetric: {
    name: string
    type: MetricType
    results: Array<{
      variantId: string
      value: number
      improvement: number
    }>
  }

  secondaryMetrics?: Array<{
    name: string
    type: MetricType
    results: Array<{
      variantId: string
      value: number
      improvement: number
    }>
  }>
}

// Real-time Analytics
export interface RealTimeAnalytics {
  timestamp: Date

  // Current Activity
  activeUsers: number
  activeSessions: number
  pageViewsPerMinute: number
  eventsPerMinute: number

  // Top Content
  topPages: Array<{
    page: string
    activeUsers: number
  }>

  // Top Referrers
  topReferrers: Array<{
    referrer: string
    activeUsers: number
  }>

  // Geographic Distribution
  topCountries: Array<{
    country: string
    activeUsers: number
  }>

  // Device Distribution
  deviceBreakdown: Array<{
    deviceType: DeviceType
    activeUsers: number
  }>

  // Recent Events
  recentEvents: Array<{
    eventType: EventType
    timestamp: Date
    userId?: string
    properties: Record<string, any>
  }>
}

// Analytics Dashboard Configuration
export interface AnalyticsDashboard {
  id: string
  name: string
  description?: string
  userId: string
  isDefault: boolean

  widgets: Array<{
    id: string
    type: "metric" | "chart" | "table" | "funnel" | "cohort"
    title: string
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
  }>

  filters: {
    dateRange: {
      start: Date
      end: Date
    }
    segments?: string[]
    customFilters?: Record<string, any>
  }

  refreshInterval?: number
  createdAt: Date
  updatedAt: Date
}

// Analytics Query Builder
export interface AnalyticsQuery {
  eventType?: EventType[]
  metrics: Array<{
    field: string
    type: MetricType
    alias?: string
  }>
  dimensions?: string[]
  filters?: Array<{
    field: string
    operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than" | "in" | "not_in"
    value: any
  }>
  timeRange: {
    start: Date
    end: Date
  }
  granularity?: TimeGranularity
  limit?: number
  orderBy?: Array<{
    field: string
    direction: "asc" | "desc"
  }>
}

export interface AnalyticsQueryResult {
  query: AnalyticsQuery
  data: Array<Record<string, any>>
  totalRows: number
  executionTime: number
  cached: boolean
  generatedAt: Date
}

// Export utility types
export type AnalyticsEventId = string
export type SessionId = string
export type UserId = string
export type BusinessId = string

export interface AnalyticsConfig {
  trackingId: string
  enableAutoTracking: boolean
  enableErrorTracking: boolean
  enablePerformanceTracking: boolean
  sampleRate: number
  cookieConsent: boolean
  anonymizeIp: boolean
  customDimensions?: Record<string, string>
}
