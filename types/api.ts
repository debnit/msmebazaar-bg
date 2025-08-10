// API request/response types for MSMEBazaar

// Base API Response Structure
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
  meta?: ApiMeta
  timestamp: string
}

export interface ApiMeta {
  pagination?: PaginationMeta
  filters?: Record<string, any>
  sort?: SortMeta
  version?: string
  requestId?: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface SortMeta {
  field: string
  order: "asc" | "desc"
}

// Error Response Types
export interface ApiError {
  code: string
  message: string
  field?: string
  details?: Record<string, any>
}

export interface ValidationError {
  field: string
  message: string
  code: string
  value?: any
}

// Request Types
export interface ApiRequest {
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean>
  query?: Record<string, string | number | boolean | string[]>
  body?: any
}

export interface PaginationRequest {
  page?: number
  limit?: number
  offset?: number
}

export interface SortRequest {
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface FilterRequest {
  filters?: Record<string, any>
  search?: string
  dateRange?: {
    start: string
    end: string
  }
}

export interface ListRequest extends PaginationRequest, SortRequest, FilterRequest {}

// Authentication API Types
export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  user: {
    id: string
    email: string
    name: string
    role: string
    isPro: boolean
    isVerified: boolean
  }
  token: string
  refreshToken: string
  expiresIn: number
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
  businessName?: string
  phone?: string
  agreeToTerms: boolean
}

export interface RegisterResponse {
  user: {
    id: string
    email: string
    name: string
    role: string
  }
  token: string
  refreshToken: string
  message: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  token: string
  refreshToken: string
  expiresIn: number
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// User API Types
export interface UpdateProfileRequest {
  name?: string
  phone?: string
  avatar?: string
  preferences?: Record<string, any>
}

export interface UserProfileResponse {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  role: string
  isPro: boolean
  isVerified: boolean
  businessId?: string
  preferences: Record<string, any>
  createdAt: string
  updatedAt: string
}

// Business API Types
export interface CreateBusinessRequest {
  businessName: string
  legalName: string
  businessType: string
  industryType: string
  description?: string
  website?: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    pincode: string
    country: string
  }
  registrationDetails: {
    pan: string
    gstin?: string
  }
}

export interface UpdateBusinessRequest {
  businessName?: string
  description?: string
  website?: string
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    pincode?: string
    country?: string
  }
  registrationDetails?: {
    gstin?: string
    udyamNumber?: string
  }
}

export interface BusinessListRequest extends ListRequest {
  industryType?: string
  businessSize?: string
  location?: string
  verified?: boolean
}

export interface BusinessSearchRequest {
  query: string
  filters?: {
    industryType?: string[]
    businessSize?: string[]
    location?: string[]
    rating?: number
  }
  location?: {
    latitude: number
    longitude: number
    radius: number
  }
  page?: number
  limit?: number
}

// Payment API Types
export interface CreatePaymentRequest {
  amount: number
  currency: string
  description?: string
  planId?: string
  metadata?: Record<string, any>
}

export interface CreatePaymentResponse {
  paymentId: string
  orderId: string
  amount: number
  currency: string
  razorpayOrderId: string
  razorpayKeyId: string
}

export interface VerifyPaymentRequest {
  paymentId: string
  razorpayPaymentId: string
  razorpayOrderId: string
  razorpaySignature: string
}

export interface VerifyPaymentResponse {
  success: boolean
  paymentStatus: string
  transactionId: string
}

export interface PaymentHistoryRequest extends ListRequest {
  status?: string
  dateRange?: {
    start: string
    end: string
  }
}

// Subscription API Types
export interface CreateSubscriptionRequest {
  planId: string
  billingCycle: string
  paymentMethodId?: string
}

export interface UpdateSubscriptionRequest {
  planId?: string
  cancelAtPeriodEnd?: boolean
}

export interface SubscriptionUsageRequest {
  subscriptionId: string
  period?: {
    start: string
    end: string
  }
}

// Document API Types
export interface UploadDocumentRequest {
  file: File
  documentType: string
  description?: string
}

export interface UploadDocumentResponse {
  documentId: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
}

export interface DocumentListRequest extends ListRequest {
  documentType?: string
  status?: string
}

// Analytics API Types
export interface AnalyticsRequest {
  period: {
    start: string
    end: string
  }
  metrics?: string[]
  groupBy?: string
  filters?: Record<string, any>
}

export interface BusinessAnalyticsResponse {
  revenue: {
    total: number
    growth: number
    trend: Array<{ date: string; value: number }>
  }
  orders: {
    total: number
    growth: number
    trend: Array<{ date: string; value: number }>
  }
  customers: {
    total: number
    new: number
    returning: number
  }
  topProducts: Array<{
    id: string
    name: string
    revenue: number
    quantity: number
  }>
}

// Marketplace API Types
export interface ProductListRequest extends ListRequest {
  category?: string
  priceRange?: {
    min: number
    max: number
  }
  location?: string
  inStock?: boolean
}

export interface CreateProductRequest {
  name: string
  description: string
  category: string
  price: number
  currency: string
  images: string[]
  specifications?: Record<string, any>
  inventory?: {
    quantity: number
    sku: string
  }
}

export interface UpdateProductRequest {
  name?: string
  description?: string
  price?: number
  images?: string[]
  specifications?: Record<string, any>
  inventory?: {
    quantity?: number
    sku?: string
  }
}

// Order API Types
export interface CreateOrderRequest {
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
  shippingAddress: {
    name: string
    phone: string
    street: string
    city: string
    state: string
    pincode: string
  }
  paymentMethod: string
}

export interface OrderListRequest extends ListRequest {
  status?: string
  dateRange?: {
    start: string
    end: string
  }
}

export interface UpdateOrderRequest {
  status?: string
  trackingNumber?: string
  notes?: string
}

// Notification API Types
export interface NotificationListRequest extends ListRequest {
  type?: string
  read?: boolean
}

export interface MarkNotificationRequest {
  notificationIds: string[]
  read: boolean
}

export interface CreateNotificationRequest {
  type: string
  title: string
  message: string
  userId?: string
  businessId?: string
  priority?: string
  actionUrl?: string
}

// File Upload API Types
export interface FileUploadRequest {
  file: File
  folder?: string
  public?: boolean
}

export interface FileUploadResponse {
  fileId: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  folder?: string
}

export interface BulkFileUploadRequest {
  files: File[]
  folder?: string
  public?: boolean
}

export interface BulkFileUploadResponse {
  files: FileUploadResponse[]
  failed: Array<{
    fileName: string
    error: string
  }>
}

// Search API Types
export interface GlobalSearchRequest {
  query: string
  types?: string[]
  filters?: Record<string, any>
  page?: number
  limit?: number
}

export interface GlobalSearchResponse {
  results: Array<{
    type: string
    id: string
    title: string
    description?: string
    url?: string
    metadata?: Record<string, any>
  }>
  pagination: PaginationMeta
  suggestions?: string[]
}

// Webhook API Types
export interface WebhookRequest {
  event: string
  data: Record<string, any>
  timestamp: string
  signature: string
}

export interface WebhookResponse {
  received: boolean
  processed: boolean
  message?: string
}

// Export utility types
export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export interface ApiEndpoint {
  method: ApiMethod
  path: string
  authenticated?: boolean
  roles?: string[]
  rateLimit?: {
    requests: number
    window: number
  }
}

export interface ApiConfig {
  baseUrl: string
  timeout: number
  retries: number
  headers: Record<string, string>
}

// Request/Response interceptor types
export interface RequestInterceptor {
  onRequest?: (config: any) => any
  onRequestError?: (error: any) => any
}

export interface ResponseInterceptor {
  onResponse?: (response: any) => any
  onResponseError?: (error: any) => any
}

// API Client configuration
export interface ApiClientConfig {
  baseUrl: string
  timeout?: number
  retries?: number
  headers?: Record<string, string>
  interceptors?: {
    request?: RequestInterceptor
    response?: ResponseInterceptor
  }
}
