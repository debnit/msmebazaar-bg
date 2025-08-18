// frontend/src/types/payment.ts

// ------------------ Core Payment Types ------------------
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
  CASH_ON_DELIVERY = "cod",
}

export enum Currency {
  INR = "INR",
  USD = "USD",
}

export enum PaymentGateway {
  RAZORPAY = "razorpay",
  STRIPE = "stripe",
  PAYU = "payu",
}

// ------------------ Razorpay Integration Types ------------------
export interface RazorpayConfig {
  key_id: string
  key_secret: string
  webhook_secret: string
  theme_color?: string
  company_name?: string
}

export interface RazorpayOrderOptions {
  amount: number // in paise
  currency: Currency
  receipt: string
  notes?: {
    customerId?: string
    invoiceId?: string
    [key: string]: string
  }
  partial_payment?: boolean
}

export interface RazorpayPaymentOptions {
  key: string
  amount: number
  currency: Currency
  name: string
  description?: string
  order_id: string
  handler: (response: RazorpayPaymentResponse) => void
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  notes?: Record<string, string>
  theme?: {
    color?: string
  }
  modal?: {
    ondismiss?: () => void
  }
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

// ------------------ Payment Transaction Types ------------------
export interface PaymentTransaction {
  id: string
  orderId: string
  userId: string
  amount: number
  currency: Currency
  status: PaymentStatus
  method: PaymentMethod
  gateway: PaymentGateway
  gatewayTransactionId?: string
  gatewayOrderId?: string
  description?: string
  metadata?: Record<string, any>
  createdAt: string // use ISO string for API
  updatedAt: string
  completedAt?: string
  failureReason?: string
}

export interface PaymentRefund {
  id: string
  transactionId: string
  amount: number
  reason: string
  status: "pending" | "processed" | "failed"
  gatewayRefundId?: string
  processedAt?: string
  createdAt: string
}

// ------------------ Subscription Types ------------------
export enum SubscriptionStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
  TRIAL = "trial",
  PAST_DUE = "past_due",
  SUSPENDED = "suspended",
}

export enum BillingCycle {
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  YEARLY = "yearly",
  LIFETIME = "lifetime",
}

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  currency: Currency
  billingCycle: BillingCycle
  features: string[]
  maxUsers?: number
  maxProjects?: number
  storageLimit?: number // in GB
  apiCallsLimit?: number
  isPopular?: boolean
  isActive: boolean
  trialDays?: number
  setupFee?: number
  discountPercentage?: number
  createdAt: string
  updatedAt: string
}

export interface Subscription {
  id: string
  userId: string
  planId: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  currentPeriodStart: string
  currentPeriodEnd: string
  trialStart?: string
  trialEnd?: string
  cancelledAt?: string
  cancelAtPeriodEnd: boolean
  gatewaySubscriptionId?: string
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

// ------------------ Invoice Types ------------------
export enum InvoiceStatus {
  DRAFT = "draft",
  SENT = "sent",
  PAID = "paid",
  OVERDUE = "overdue",
  CANCELLED = "cancelled",
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
  taxRate?: number
  taxAmount?: number
  hsnCode?: string // HSN code for GST
}

export interface GSTDetails {
  gstin: string
  legalName: string
  address: {
    street: string
    city: string
    state: string
    pincode: string
    country: string
  }
}

export interface Invoice {
  id: string
  invoiceNumber: string
  userId: string
  subscriptionId?: string
  status: InvoiceStatus
  items: InvoiceItem[]
  subtotal: number
  taxAmount: number
  totalAmount: number
  currency: Currency
  dueDate: string
  paidAt?: string
  gstDetails?: {
    cgst: number
    sgst: number
    igst: number
    totalGst: number
  }
  billingAddress: {
    name: string
    email: string
    phone?: string
    address: {
      street: string
      city: string
      state: string
      pincode: string
      country: string
    }
    gstDetails?: GSTDetails
  }
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

// ------------------ Analytics Types ------------------
export interface PaymentAnalytics {
  totalRevenue: number
  totalTransactions: number
  successRate: number
  averageTransactionValue: number
  topPaymentMethods: Array<{
    method: PaymentMethod
    count: number
    percentage: number
  }>
  monthlyRevenue: Array<{
    month: string
    revenue: number
    transactions: number
  }>
  failureReasons: Array<{
    reason: string
    count: number
  }>
}

export interface SubscriptionAnalytics {
  totalSubscriptions: number
  activeSubscriptions: number
  churnRate: number
  monthlyRecurringRevenue: number
  averageRevenuePerUser: number
  planDistribution: Array<{
    planId: string
    planName: string
    count: number
    revenue: number
  }>
  subscriptionGrowth: Array<{
    month: string
    newSubscriptions: number
    cancelledSubscriptions: number
    netGrowth: number
  }>
}

// ------------------ Webhook Types ------------------
export enum WebhookEventType {
  PAYMENT_AUTHORIZED = "payment.authorized",
  PAYMENT_CAPTURED = "payment.captured",
  PAYMENT_FAILED = "payment.failed",
  ORDER_PAID = "order.paid",
  SUBSCRIPTION_ACTIVATED = "subscription.activated",
  SUBSCRIPTION_CHARGED = "subscription.charged",
  SUBSCRIPTION_CANCELLED = "subscription.cancelled",
  REFUND_PROCESSED = "refund.processed",
}

export interface WebhookEvent {
  id: string
  type: WebhookEventType
  data: Record<string, any>
  signature: string
  timestamp: string
  processed: boolean
  processedAt?: string
  error?: string
}

// ------------------ Gateway Response Types ------------------
export interface PaymentGatewayResponse {
  success: boolean
  transactionId?: string
  orderId?: string
  amount?: number
  currency?: Currency
  status?: PaymentStatus
  message?: string
  error?: {
    code: string
    description: string
    field?: string
  }
  metadata?: Record<string, any>
}

// ------------------ Indian Payment Specific Types ------------------
export interface UPIPayment {
  vpa: string
  transactionId: string
  amount: number
  description?: string
}

export interface NetBankingPayment {
  bankCode: string
  bankName: string
  accountNumber?: string
  ifscCode?: string
}

export enum WalletType {
  PAYTM = "paytm",
  PHONEPE = "phonepe",
  GOOGLEPAY = "googlepay",
  AMAZONPAY = "amazonpay",
  MOBIKWIK = "mobikwik",
}

export interface WalletPayment {
  walletType: WalletType
  walletId?: string
}

// ------------------ EMI Options ------------------
export interface EMIOption {
  bankName: string
  tenure: number // in months
  interestRate: number
  emiAmount: number
  totalAmount: number
  processingFee?: number
}

// ------------------ Payment Form Types ------------------
export interface PaymentFormData {
  amount: number
  currency: Currency
  method: PaymentMethod
  description?: string
  customerDetails: {
    name: string
    email: string
    phone: string
  }
  billingAddress?: {
    street: string
    city: string
    state: string
    pincode: string
    country: string
  }
  gstDetails?: GSTDetails
  metadata?: Record<string, any>
}

// ------------------ Payment Configuration ------------------
export interface PaymentConfig {
  enabledMethods: PaymentMethod[]
  minAmount: number
  maxAmount: number
  currency: Currency
  gstRate: number
  processingFee?: number
  razorpayConfig: RazorpayConfig
  webhookUrl: string
  returnUrl: string
  cancelUrl: string
}
