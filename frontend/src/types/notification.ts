export interface BaseNotification {
  id: string
  userId: string
  title: string
  message: string
  type: NotificationType
  priority: NotificationPriority
  status: NotificationStatus
  createdAt: Date
  updatedAt: Date
  readAt?: Date
  expiresAt?: Date
  metadata?: Record<string, any>
}

export enum NotificationType {
  SYSTEM = "system",
  ORDER = "order",
  PAYMENT = "payment",
  BUSINESS = "business",
  MARKETING = "marketing",
  SECURITY = "security",
  FEATURE = "feature",
  COMPLIANCE = "compliance",
  LOAN = "loan",
  MARKETPLACE = "marketplace",
}

export enum NotificationPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export enum NotificationStatus {
  PENDING = "pending",
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
  FAILED = "failed",
  EXPIRED = "expired",
}

export enum NotificationChannel {
  IN_APP = "in_app",
  EMAIL = "email",
  SMS = "sms",
  PUSH = "push",
  WHATSAPP = "whatsapp",
}

// Specific notification types
export interface OrderNotification extends BaseNotification {
  type: NotificationType.ORDER
  orderId: string
  orderStatus: string
  vendorId?: string
  amount?: number
  trackingNumber?: string
}

export interface PaymentNotification extends BaseNotification {
  type: NotificationType.PAYMENT
  paymentId: string
  transactionId?: string
  amount: number
  currency: string
  paymentStatus: string
  paymentMethod: string
}

export interface BusinessNotification extends BaseNotification {
  type: NotificationType.BUSINESS
  businessId: string
  documentType?: string
  verificationStatus?: string
  complianceType?: string
}

export interface SecurityNotification extends BaseNotification {
  type: NotificationType.SECURITY
  securityEvent: SecurityEventType
  ipAddress?: string
  deviceInfo?: string
  location?: string
}

export enum SecurityEventType {
  LOGIN_SUCCESS = "login_success",
  LOGIN_FAILED = "login_failed",
  PASSWORD_CHANGED = "password_changed",
  ACCOUNT_LOCKED = "account_locked",
  SUSPICIOUS_ACTIVITY = "suspicious_activity",
  TWO_FA_ENABLED = "two_fa_enabled",
  TWO_FA_DISABLED = "two_fa_disabled",
}

export interface LoanNotification extends BaseNotification {
  type: NotificationType.LOAN
  loanId: string
  loanStatus: string
  amount?: number
  dueDate?: Date
  installmentAmount?: number
}

export interface MarketplaceNotification extends BaseNotification {
  type: NotificationType.MARKETPLACE
  productId?: string
  vendorId?: string
  categoryId?: string
  actionType: MarketplaceActionType
}

export enum MarketplaceActionType {
  PRODUCT_APPROVED = "product_approved",
  PRODUCT_REJECTED = "product_rejected",
  VENDOR_APPROVED = "vendor_approved",
  VENDOR_SUSPENDED = "vendor_suspended",
  REVIEW_RECEIVED = "review_received",
  STOCK_LOW = "stock_low",
  COMMISSION_PAID = "commission_paid",
}

// Notification preferences
export interface NotificationPreferences {
  userId: string
  channels: NotificationChannelPreference[]
  types: NotificationTypePreference[]
  quietHours?: QuietHours
  frequency: NotificationFrequency
  language: string
  timezone: string
}

export interface NotificationChannelPreference {
  channel: NotificationChannel
  enabled: boolean
  types: NotificationType[]
}

export interface NotificationTypePreference {
  type: NotificationType
  enabled: boolean
  channels: NotificationChannel[]
  priority: NotificationPriority
}

export interface QuietHours {
  enabled: boolean
  startTime: string // HH:mm format
  endTime: string // HH:mm format
  timezone: string
  days: number[] // 0-6, Sunday = 0
}

export enum NotificationFrequency {
  IMMEDIATE = "immediate",
  HOURLY = "hourly",
  DAILY = "daily",
  WEEKLY = "weekly",
}

// Notification templates
export interface NotificationTemplate {
  id: string
  name: string
  type: NotificationType
  channel: NotificationChannel
  subject: string
  body: string
  variables: TemplateVariable[]
  isActive: boolean
  language: string
  createdAt: Date
  updatedAt: Date
}

export interface TemplateVariable {
  name: string
  type: "string" | "number" | "date" | "boolean"
  required: boolean
  defaultValue?: any
  description?: string
}

// Notification campaigns
export interface NotificationCampaign {
  id: string
  name: string
  description?: string
  type: CampaignType
  status: CampaignStatus
  templateId: string
  targetAudience: TargetAudience
  schedule: CampaignSchedule
  channels: NotificationChannel[]
  metrics: CampaignMetrics
  createdAt: Date
  updatedAt: Date
  startedAt?: Date
  completedAt?: Date
}

export enum CampaignType {
  PROMOTIONAL = "promotional",
  TRANSACTIONAL = "transactional",
  ANNOUNCEMENT = "announcement",
  REMINDER = "reminder",
  SURVEY = "survey",
}

export enum CampaignStatus {
  DRAFT = "draft",
  SCHEDULED = "scheduled",
  RUNNING = "running",
  PAUSED = "paused",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface TargetAudience {
  userIds?: string[]
  segments?: AudienceSegment[]
  filters?: AudienceFilter[]
  excludeUserIds?: string[]
}

export interface AudienceSegment {
  id: string
  name: string
  criteria: SegmentCriteria
}

export interface SegmentCriteria {
  userType?: string[]
  businessType?: string[]
  location?: string[]
  registrationDate?: DateRange
  lastActiveDate?: DateRange
  subscriptionStatus?: string[]
  orderCount?: NumberRange
  totalSpent?: NumberRange
}

export interface AudienceFilter {
  field: string
  operator: FilterOperator
  value: any
}

export enum FilterOperator {
  EQUALS = "equals",
  NOT_EQUALS = "not_equals",
  CONTAINS = "contains",
  NOT_CONTAINS = "not_contains",
  GREATER_THAN = "greater_than",
  LESS_THAN = "less_than",
  BETWEEN = "between",
  IN = "in",
  NOT_IN = "not_in",
}

export interface DateRange {
  start: Date
  end: Date
}

export interface NumberRange {
  min: number
  max: number
}

export interface CampaignSchedule {
  type: ScheduleType
  sendAt?: Date
  timezone: string
  recurring?: RecurringSchedule
}

export enum ScheduleType {
  IMMEDIATE = "immediate",
  SCHEDULED = "scheduled",
  RECURRING = "recurring",
}

export interface RecurringSchedule {
  frequency: RecurringFrequency
  interval: number
  daysOfWeek?: number[]
  dayOfMonth?: number
  endDate?: Date
  maxOccurrences?: number
}

export enum RecurringFrequency {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

export interface CampaignMetrics {
  totalRecipients: number
  sent: number
  delivered: number
  opened: number
  clicked: number
  unsubscribed: number
  bounced: number
  failed: number
  openRate: number
  clickRate: number
  unsubscribeRate: number
  bounceRate: number
}

// Push notification specific types
export interface PushNotificationPayload {
  title: string
  body: string
  icon?: string
  image?: string
  badge?: number
  sound?: string
  tag?: string
  data?: Record<string, any>
  actions?: NotificationAction[]
  requireInteraction?: boolean
  silent?: boolean
  timestamp?: number
  vibrate?: number[]
}

export interface NotificationAction {
  action: string
  title: string
  icon?: string
}

// Email notification specific types
export interface EmailNotificationPayload {
  to: string[]
  cc?: string[]
  bcc?: string[]
  subject: string
  htmlBody: string
  textBody?: string
  attachments?: EmailAttachment[]
  replyTo?: string
  headers?: Record<string, string>
}

export interface EmailAttachment {
  filename: string
  content: string | Buffer
  contentType: string
  encoding?: string
  cid?: string
}

// SMS notification specific types
export interface SMSNotificationPayload {
  to: string
  message: string
  senderId?: string
  templateId?: string
  variables?: Record<string, string>
}

// WhatsApp notification specific types
export interface WhatsAppNotificationPayload {
  to: string
  type: WhatsAppMessageType
  text?: WhatsAppTextMessage
  template?: WhatsAppTemplateMessage
  media?: WhatsAppMediaMessage
}

export enum WhatsAppMessageType {
  TEXT = "text",
  TEMPLATE = "template",
  IMAGE = "image",
  DOCUMENT = "document",
  VIDEO = "video",
  AUDIO = "audio",
}

export interface WhatsAppTextMessage {
  body: string
}

export interface WhatsAppTemplateMessage {
  name: string
  language: string
  components?: WhatsAppTemplateComponent[]
}

export interface WhatsAppTemplateComponent {
  type: "header" | "body" | "footer" | "button"
  parameters?: WhatsAppTemplateParameter[]
}

export interface WhatsAppTemplateParameter {
  type: "text" | "currency" | "date_time" | "image" | "document" | "video"
  text?: string
  currency?: WhatsAppCurrency
  date_time?: WhatsAppDateTime
  image?: WhatsAppMedia
  document?: WhatsAppMedia
  video?: WhatsAppMedia
}

export interface WhatsAppCurrency {
  fallback_value: string
  code: string
  amount_1000: number
}

export interface WhatsAppDateTime {
  fallback_value: string
  day_of_week?: number
  year?: number
  month?: number
  day_of_month?: number
  hour?: number
  minute?: number
  calendar?: string
}

export interface WhatsAppMedia {
  id?: string
  link?: string
  caption?: string
  filename?: string
}

export interface WhatsAppMediaMessage {
  id?: string
  link?: string
  caption?: string
  filename?: string
}

// Notification delivery tracking
export interface NotificationDelivery {
  id: string
  notificationId: string
  userId: string
  channel: NotificationChannel
  status: DeliveryStatus
  attempts: number
  lastAttemptAt?: Date
  deliveredAt?: Date
  failureReason?: string
  externalId?: string
  metadata?: Record<string, any>
}

export enum DeliveryStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  DELIVERED = "delivered",
  FAILED = "failed",
  BOUNCED = "bounced",
  UNSUBSCRIBED = "unsubscribed",
}

// Notification analytics
export interface NotificationAnalytics {
  period: AnalyticsPeriod
  totalSent: number
  totalDelivered: number
  totalOpened: number
  totalClicked: number
  deliveryRate: number
  openRate: number
  clickRate: number
  byChannel: ChannelAnalytics[]
  byType: TypeAnalytics[]
  trends: AnalyticsTrend[]
}

export interface AnalyticsPeriod {
  start: Date
  end: Date
  granularity: "hour" | "day" | "week" | "month"
}

export interface ChannelAnalytics {
  channel: NotificationChannel
  sent: number
  delivered: number
  opened: number
  clicked: number
  deliveryRate: number
  openRate: number
  clickRate: number
}

export interface TypeAnalytics {
  type: NotificationType
  sent: number
  delivered: number
  opened: number
  clicked: number
  deliveryRate: number
  openRate: number
  clickRate: number
}

export interface AnalyticsTrend {
  date: Date
  sent: number
  delivered: number
  opened: number
  clicked: number
}

// API types
export interface CreateNotificationRequest {
  userId: string
  title: string
  message: string
  type: NotificationType
  priority?: NotificationPriority
  channels?: NotificationChannel[]
  metadata?: Record<string, any>
  expiresAt?: Date
  scheduleAt?: Date
}

export interface UpdateNotificationRequest {
  title?: string
  message?: string
  priority?: NotificationPriority
  status?: NotificationStatus
  metadata?: Record<string, any>
  expiresAt?: Date
}

export interface NotificationListRequest {
  userId?: string
  type?: NotificationType
  status?: NotificationStatus
  priority?: NotificationPriority
  channel?: NotificationChannel
  unreadOnly?: boolean
  page?: number
  limit?: number
  sortBy?: "createdAt" | "updatedAt" | "priority"
  sortOrder?: "asc" | "desc"
}

export interface NotificationListResponse {
  notifications: BaseNotification[]
  total: number
  page: number
  limit: number
  hasMore: boolean
  unreadCount: number
}

export interface MarkAsReadRequest {
  notificationIds: string[]
}

export interface BulkDeleteRequest {
  notificationIds: string[]
}

export interface NotificationPreferencesUpdateRequest {
  channels?: NotificationChannelPreference[]
  types?: NotificationTypePreference[]
  quietHours?: QuietHours
  frequency?: NotificationFrequency
  language?: string
  timezone?: string
}