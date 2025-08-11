// Payment and subscription types for MSMEBazaar

export enum PaymentStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
  PARTIALLY_REFUNDED = "partially_refunded",
}

export enum PaymentMethod {
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  NET_BANKING = "net_banking",
  UPI = "upi",
  WALLET = "wallet",
  EMI = "emi",
  BANK_TRANSFER = "bank_transfer",
  CASH_ON_DELIVERY = "cash_on_delivery",
}

export enum SubscriptionStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
  SUSPENDED = "suspended",
  TRIAL = "trial",
  PAST_DUE = "past_due",
}

export enum PlanType {
  FREE = "free",
  BASIC = "basic",
  PRO = "pro",
  PREMIUM = "premium",
  ENTERPRISE = "enterprise",
}

export enum BillingCycle {
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  YEARLY = "yearly",
  ONE_TIME = "one_time",
}

export enum Currency {
  INR = "INR",
  USD = "USD",
  EUR = "EUR",
}

export enum TaxType {
  GST = "gst",
  IGST = "igst",
  CGST = "cgst",
  SGST = "sgst",
  CESS = "cess",
}

// Core payment interfaces
export interface Payment {
  id: string
  orderId: string
  userId: string
  amount: number
  currency: Currency
  status: PaymentStatus
  method: PaymentMethod
  gateway: "razorpay" | "stripe" | "payu" | "cashfree"
  gatewayTransactionId?: string
  gatewayOrderId?: string
  description?: string
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  failureReason?: string
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: Currency
  description: string
  metadata?: Record<string, any>
  clientSecret?: string
  status: "requires_payment_method" | "requires_confirmation" | "processing" | "succeeded" | "canceled"
}

// Razorpay specific types
export interface RazorpayOrder {
  id: string
  entity: "order"
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  receipt?: string
  offer_id?: string
  status: "created" | "attempted" | "paid"
  attempts: number
  notes: Record<string, any>
  created_at: number
}

export interface RazorpayPayment {
  id: string
  entity: "payment"
  amount: number
  currency: string
  status: "created" | "authorized" | "captured" | "refunded" | "failed"
  order_id: string
  invoice_id?: string
  international: boolean
  method: string
  amount_refunded: number
  refund_status?: string
  captured: boolean
  description?: string
  card_id?: string
  bank?: string
  wallet?: string
  vpa?: string
  email: string
  contact: string
  notes: Record<string, any>
  fee?: number
  tax?: number
  error_code?: string
  error_description?: string
  error_source?: string
  error_step?: string
  error_reason?: string
  created_at: number
}

// Subscription interfaces
export interface Subscription {
  id: string
  userId: string
  planId: string
  status: SubscriptionStatus
  currentPeriodStart: Date
  currentPeriodEnd: Date
  trialStart?: Date
  trialEnd?: Date
  cancelledAt?: Date
  cancelAtPeriodEnd: boolean
  billingCycle: BillingCycle
  amount: number
  currency: Currency
  discountAmount?: number
  taxAmount?: number
  totalAmount: number
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  type: PlanType
  price: number
  currency: Currency
  billingCycle: BillingCycle
  trialPeriodDays?: number
  features: string[]
  limits: PlanLimits
  popular?: boolean
  recommended?: boolean
  metadata?: Record<string, any>
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PlanLimits {
  users?: number
  storage?: number // in GB
  apiCalls?: number
  transactions?: number
  products?: number
  orders?: number
  customFields?: number
  integrations?: number
  supportLevel: "basic" | "priority" | "dedicated"
  features: Record<string, boolean | number>
}

// Invoice and billing
export interface Invoice {
  id: string
  number: string
  userId: string
  subscriptionId?: string
  status: "draft" | "open" | "paid" | "void" | "uncollectible"
  amount: number
  currency: Currency
  taxAmount: number
  discountAmount: number
  totalAmount: number
  dueDate: Date
  paidAt?: Date
  items: InvoiceItem[]
  billingAddress: BillingAddress
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
  taxRate?: number
  taxAmount?: number
  metadata?: Record<string, any>
}

export interface BillingAddress {
  name: string
  email: string
  phone?: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  gstin?: string // GST Identification Number for Indian businesses
}

// Tax calculation
export interface TaxCalculation {
  subtotal: number
  taxes: TaxBreakdown[]
  totalTax: number
  total: number
}

export interface TaxBreakdown {
  type: TaxType
  rate: number
  amount: number
  description: string
}

// Discount and coupon
export interface Discount {
  id: string
  code: string
  name: string
  description?: string
  type: "percentage" | "fixed_amount"
  value: number
  currency?: Currency
  minimumAmount?: number
  maximumDiscount?: number
  usageLimit?: number
  usageCount: number
  validFrom: Date
  validUntil?: Date
  applicablePlans?: string[]
  firstTimeOnly?: boolean
  active: boolean
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface AppliedDiscount {
  discountId: string
  code: string
  amount: number
  appliedAt: Date
}

// Payment method management
export interface SavedPaymentMethod {
  id: string
  userId: string
  type: PaymentMethod
  isDefault: boolean
  details: PaymentMethodDetails
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface PaymentMethodDetails {
  // Card details
  cardLast4?: string
  cardBrand?: string
  cardExpMonth?: number
  cardExpYear?: number

  // Bank details
  bankName?: string
  accountLast4?: string

  // UPI details
  upiId?: string

  // Wallet details
  walletProvider?: string
  walletId?: string
}

// Refund management
export interface Refund {
  id: string
  paymentId: string
  amount: number
  currency: Currency
  reason: string
  status: "pending" | "processing" | "completed" | "failed"
  gatewayRefundId?: string
  processedAt?: Date
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

// Payment analytics
export interface PaymentAnalytics {
  period: {
    start: Date
    end: Date
  }
  totalRevenue: number
  totalTransactions: number
  successRate: number
  averageOrderValue: number
  topPaymentMethods: Array<{
    method: PaymentMethod
    count: number
    amount: number
  }>
  revenueByPlan: Record<string, number>
  churnRate: number
  mrr: number // Monthly Recurring Revenue
  arr: number // Annual Recurring Revenue
  ltv: number // Customer Lifetime Value
}

// Webhook events
export interface PaymentWebhookEvent {
  id: string
  type: string
  data: {
    object: RazorpayPayment | RazorpayOrder | any
  }
  created_at: number
}

// Payment configuration
export interface PaymentConfig {
  razorpay: {
    keyId: string
    keySecret: string
    webhookSecret: string
  }
  stripe?: {
    publishableKey: string
    secretKey: string
    webhookSecret: string
  }
  defaultCurrency: Currency
  supportedCurrencies: Currency[]
  supportedPaymentMethods: PaymentMethod[]
  taxRates: Record<string, number>
  minimumAmount: number
  maximumAmount: number
}

// Subscription management
export interface SubscriptionChange {
  id: string
  subscriptionId: string
  type: "upgrade" | "downgrade" | "cancel" | "reactivate"
  fromPlanId: string
  toPlanId?: string
  effectiveDate: Date
  prorationAmount?: number
  reason?: string
  metadata?: Record<string, any>
  createdAt: Date
}

export interface SubscriptionUsage {
  subscriptionId: string
  period: {
    start: Date
    end: Date
  }
  usage: Record<
    string,
    {
      used: number
      limit: number
      unit: string
    }
  >
  overage?: Record<
    string,
    {
      amount: number
      rate: number
    }
  >
}

// Payment form types
export interface PaymentFormData {
  amount: number
  currency: Currency
  planId?: string
  discountCode?: string
  billingAddress: BillingAddress
  paymentMethod: PaymentMethod
  savePaymentMethod?: boolean
  metadata?: Record<string, any>
}

export interface CheckoutSession {
  id: string
  userId: string
  planId?: string
  amount: number
  currency: Currency
  discountCode?: string
  discountAmount?: number
  taxAmount: number
  totalAmount: number
  billingAddress: BillingAddress
  expiresAt: Date
  metadata?: Record<string, any>
  createdAt: Date
}

// API response types
export interface PaymentResponse {
  success: boolean
  payment?: Payment
  paymentIntent?: PaymentIntent
  error?: string
  message?: string
}

export interface SubscriptionResponse {
  success: boolean
  subscription?: Subscription
  error?: string
  message?: string
}

export interface InvoiceResponse {
  success: boolean
  invoice?: Invoice
  error?: string
  message?: string
}

// Utility types
export type PaymentId = string
export type SubscriptionId = string
export type PlanId = string
export type InvoiceId = string
export type DiscountId = string

export interface PaymentSummary {
  totalAmount: number
  subtotal: number
  taxAmount: number
  discountAmount: number
  currency: Currency
  breakdown: {
    planAmount: number
    addonsAmount: number
    usageAmount: number
  }
}

export interface BillingHistory {
  invoices: Invoice[]
  payments: Payment[]
  refunds: Refund[]
  subscriptionChanges: SubscriptionChange[]
}
