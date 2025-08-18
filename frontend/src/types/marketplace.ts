export interface Product {
  id: string
  name: string
  description: string
  shortDescription?: string
  sku: string
  barcode?: string
  hsn?: string // HSN code for Indian tax classification

  // Pricing
  price: number
  originalPrice?: number
  discount?: number
  discountType: "percentage" | "fixed"
  currency: string

  // Inventory
  stock: number
  minStock: number
  maxStock?: number
  stockStatus: ProductStockStatus

  // Categories and Tags
  categoryId: string
  subcategoryId?: string
  tags: string[]
  brand?: string

  // Media
  images: ProductImage[]
  videos?: ProductVideo[]

  // Specifications
  specifications: ProductSpecification[]
  variants?: ProductVariant[]

  // SEO and Marketing
  slug: string
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]

  // Status and Visibility
  status: ProductStatus
  visibility: ProductVisibility
  featured: boolean

  // Vendor Information
  vendorId: string
  vendor?: Vendor

  // Ratings and Reviews
  rating: number
  reviewCount: number

  // Shipping
  weight?: number
  dimensions?: ProductDimensions
  shippingClass?: string

  // Timestamps
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
}

export enum ProductStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  INACTIVE = "inactive",
  OUT_OF_STOCK = "out_of_stock",
  DISCONTINUED = "discontinued",
}

export enum ProductVisibility {
  PUBLIC = "public",
  PRIVATE = "private",
  HIDDEN = "hidden",
}

export enum ProductStockStatus {
  IN_STOCK = "in_stock",
  LOW_STOCK = "low_stock",
  OUT_OF_STOCK = "out_of_stock",
  BACKORDER = "backorder",
}

export interface ProductImage {
  id: string
  url: string
  alt: string
  isPrimary: boolean
  order: number
}

export interface ProductVideo {
  id: string
  url: string
  thumbnail: string
  title: string
  duration?: number
}

export interface ProductSpecification {
  name: string
  value: string
  unit?: string
  group?: string
}

export interface ProductVariant {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  attributes: VariantAttribute[]
  image?: string
}

export interface VariantAttribute {
  name: string
  value: string
}

export interface ProductDimensions {
  length: number
  width: number
  height: number
  unit: "cm" | "inch"
}

// Vendor Types
export interface Vendor {
  id: string
  businessName: string
  displayName: string
  description?: string
  logo?: string
  banner?: string

  // Contact Information
  email: string
  phone: string
  website?: string

  // Address
  address: VendorAddress

  // Business Details
  gstNumber?: string
  panNumber?: string
  udyamNumber?: string
  businessType: string // BusinessType

  // Marketplace Status
  status: VendorStatus
  verificationStatus: VendorVerificationStatus
  joinedAt: Date

  // Performance Metrics
  rating: number
  reviewCount: number
  totalSales: number
  totalOrders: number

  // Subscription
  subscriptionPlan: VendorSubscriptionPlan
  subscriptionStatus: string // SubscriptionStatus

  // Settings
  settings: VendorSettings

  // Commission
  commissionRate: number

  // Bank Details
  bankDetails?: VendorBankDetails
}

export interface VendorAddress {
  street: string
  city: string
  state: string
  pincode: string
  country: string
  landmark?: string
}

export enum VendorStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  PENDING = "pending",
}

export enum VendorVerificationStatus {
  UNVERIFIED = "unverified",
  PENDING = "pending",
  VERIFIED = "verified",
  REJECTED = "rejected",
}

export enum VendorSubscriptionPlan {
  FREE = "free",
  BASIC = "basic",
  PREMIUM = "premium",
  ENTERPRISE = "enterprise",
}

export interface VendorSettings {
  autoAcceptOrders: boolean
  processingTime: number // in days
  returnPolicy: string
  shippingPolicy: string
  notifications: VendorNotificationSettings
}

export interface VendorNotificationSettings {
  newOrders: boolean
  lowStock: boolean
  reviews: boolean
  payments: boolean
}

export interface VendorBankDetails {
  accountNumber: string
  ifscCode: string
  bankName: string
  accountHolderName: string
  accountType: "savings" | "current"
}

// Category Types
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  icon?: string
  parentId?: string
  children?: Category[]
  level: number
  order: number
  isActive: boolean
  productCount: number
  metaTitle?: string
  metaDescription?: string
}

// Order Types
export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customer?: Customer

  // Order Items
  items: OrderItem[]

  // Pricing
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  currency: string

  // Status
  status: OrderStatus
  paymentStatus: PaymentStatus
  fulfillmentStatus: FulfillmentStatus

  // Addresses
  billingAddress: OrderAddress
  shippingAddress: OrderAddress

  // Payment
  paymentMethod: string
  paymentId?: string

  // Shipping
  shippingMethod: string
  trackingNumber?: string
  estimatedDelivery?: Date
  actualDelivery?: Date

  // Notes
  customerNotes?: string
  internalNotes?: string

  // Timestamps
  createdAt: Date
  updatedAt: Date
  shippedAt?: Date
  deliveredAt?: Date
}

export interface OrderItem {
  id: string
  productId: string
  product?: Product
  variantId?: string
  variant?: ProductVariant
  vendorId: string
  vendor?: Vendor

  quantity: number
  price: number
  total: number

  status: OrderItemStatus
}

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  RETURNED = "returned",
  REFUNDED = "refunded",
}

export enum OrderItemStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  RETURNED = "returned",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
  PARTIALLY_REFUNDED = "partially_refunded",
}

export enum FulfillmentStatus {
  UNFULFILLED = "unfulfilled",
  PARTIALLY_FULFILLED = "partially_fulfilled",
  FULFILLED = "fulfilled",
}

export interface OrderAddress {
  name: string
  email?: string
  phone?: string
  street: string
  city: string
  state: string
  pincode: string
  country: string
  landmark?: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  totalOrders: number
  totalSpent: number
  joinedAt: Date
}

// Review Types
export interface Review {
  id: string
  productId: string
  product?: Product
  customerId: string
  customer?: Customer
  orderId?: string

  rating: number
  title?: string
  comment: string

  // Media
  images?: ReviewImage[]
  videos?: ReviewVideo[]

  // Status
  status: ReviewStatus
  isVerifiedPurchase: boolean

  // Helpful votes
  helpfulCount: number
  unhelpfulCount: number

  // Vendor Response
  vendorResponse?: VendorResponse

  // Timestamps
  createdAt: Date
  updatedAt: Date
}

export interface ReviewImage {
  id: string
  url: string
  alt?: string
}

export interface ReviewVideo {
  id: string
  url: string
  thumbnail: string
  duration?: number
}

export enum ReviewStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  FLAGGED = "flagged",
}

export interface VendorResponse {
  id: string
  vendorId: string
  message: string
  createdAt: Date
}

// Search and Filter Types
export interface SearchFilters {
  query?: string
  categoryId?: string
  vendorId?: string
  priceMin?: number
  priceMax?: number
  rating?: number
  inStock?: boolean
  brand?: string[]
  tags?: string[]
  location?: string
  sortBy?: SearchSortBy
  sortOrder?: "asc" | "desc"
}

export enum SearchSortBy {
  RELEVANCE = "relevance",
  PRICE = "price",
  RATING = "rating",
  NEWEST = "newest",
  POPULARITY = "popularity",
  SALES = "sales",
}

export interface SearchResult {
  products: Product[]
  total: number
  page: number
  limit: number
  filters: SearchFilters
  facets: SearchFacets
}

export interface SearchFacets {
  categories: FacetItem[]
  brands: FacetItem[]
  priceRanges: PriceRangeFacet[]
  ratings: RatingFacet[]
  vendors: FacetItem[]
}

export interface FacetItem {
  value: string
  label: string
  count: number
}

export interface PriceRangeFacet {
  min: number
  max: number
  count: number
}

export interface RatingFacet {
  rating: number
  count: number
}

// Cart Types
export interface Cart {
  id: string
  customerId?: string
  sessionId?: string
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  currency: string
  createdAt: Date
  updatedAt: Date
  expiresAt?: Date
}

export interface CartItem {
  id: string
  productId: string
  product?: Product
  variantId?: string
  variant?: ProductVariant
  quantity: number
  price: number
  total: number
  addedAt: Date
}

// Wishlist Types
export interface Wishlist {
  id: string
  customerId: string
  name: string
  isDefault: boolean
  items: WishlistItem[]
  createdAt: Date
  updatedAt: Date
}

export interface WishlistItem {
  id: string
  productId: string
  product?: Product
  variantId?: string
  variant?: ProductVariant
  addedAt: Date
}

// Inventory Types
export interface InventoryItem {
  id: string
  productId: string
  variantId?: string
  vendorId: string

  quantity: number
  reserved: number
  available: number

  location?: string
  warehouse?: string

  lastUpdated: Date
  lastStockMovement?: Date
}

export interface StockMovement {
  id: string
  inventoryItemId: string
  type: StockMovementType
  quantity: number
  reason: string
  reference?: string
  createdAt: Date
  createdBy: string
}

export enum StockMovementType {
  IN = "in",
  OUT = "out",
  ADJUSTMENT = "adjustment",
  RESERVED = "reserved",
  RELEASED = "released",
}

// Commission Types
export interface Commission {
  id: string
  vendorId: string
  orderId: string
  orderItemId: string

  saleAmount: number
  commissionRate: number
  commissionAmount: number

  status: CommissionStatus
  paidAt?: Date

  createdAt: Date
}

export enum CommissionStatus {
  PENDING = "pending",
  APPROVED = "approved",
  PAID = "paid",
  DISPUTED = "disputed",
}

// Shipping Types
export interface ShippingMethod {
  id: string
  name: string
  description?: string
  provider: string
  cost: number
  estimatedDays: number
  isActive: boolean
  zones: ShippingZone[]
}

export interface ShippingZone {
  id: string
  name: string
  countries: string[]
  states?: string[]
  pincodes?: string[]
}

// Analytics Types
export interface MarketplaceAnalytics {
  totalProducts: number
  totalVendors: number
  totalOrders: number
  totalRevenue: number

  topProducts: ProductAnalytics[]
  topVendors: VendorAnalytics[]
  topCategories: CategoryAnalytics[]

  salesTrend: SalesTrendData[]
  orderTrend: OrderTrendData[]
}

export interface ProductAnalytics {
  productId: string
  product?: Product
  views: number
  orders: number
  revenue: number
  conversionRate: number
}

export interface VendorAnalytics {
  vendorId: string
  vendor?: Vendor
  products: number
  orders: number
  revenue: number
  rating: number
}

export interface CategoryAnalytics {
  categoryId: string
  category?: Category
  products: number
  orders: number
  revenue: number
}

export interface SalesTrendData {
  date: string
  revenue: number
  orders: number
}

export interface OrderTrendData {
  date: string
  orders: number
  averageOrderValue: number
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  score_retrieval?: number;
  score_ranked?: number;
  // any other fields needed by this UI
}

export interface matchmakingResult {
  msmeId: string;
  matchedEntityId: string;
  score: number;
  createdAt: string;
  // Extend as needed...
}

export interface chatSession {
  msmeId: string;
  matchedEntityId: string;
  score: number;
  createdAt: string;
  // Extend as needed...
}

