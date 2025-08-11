// Application Configuration
export const APP_CONFIG = {
  name: "MSMEBazaar",
  version: "1.0.0",
  description: "India's Premier MSME Business Platform",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://msmebazaar.com",
  supportEmail: "support@msmebazaar.com",
  supportPhone: "+91-1800-123-4567",
} as const

// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://api.msmebazaar.com",
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
  version: "v1",
} as const

// Authentication
export const AUTH_CONFIG = {
  tokenKey: "auth_token",
  refreshTokenKey: "refresh_token",
  userKey: "user_data",
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  refreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
} as const

// User Roles
export const USER_ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  BUSINESS_OWNER: "business_owner",
  EMPLOYEE: "employee",
  VENDOR: "vendor",
  CUSTOMER: "customer",
} as const

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  BASIC: "basic",
  PRO: "pro",
  ENTERPRISE: "enterprise",
} as const

// Feature Access Levels
export const ACCESS_LEVELS = {
  READ: "read",
  WRITE: "write",
  ADMIN: "admin",
  OWNER: "owner",
} as const

// Business Types (Indian MSME Classification)
export const BUSINESS_TYPES = {
  MICRO: "micro",
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
} as const

// Business Categories
export const BUSINESS_CATEGORIES = {
  MANUFACTURING: "manufacturing",
  TRADING: "trading",
  SERVICE: "service",
  RETAIL: "retail",
  WHOLESALE: "wholesale",
  EXPORT_IMPORT: "export_import",
  AGRICULTURE: "agriculture",
  TEXTILE: "textile",
  FOOD_PROCESSING: "food_processing",
  HANDICRAFTS: "handicrafts",
  IT_SOFTWARE: "it_software",
  HEALTHCARE: "healthcare",
  EDUCATION: "education",
  LOGISTICS: "logistics",
  CONSTRUCTION: "construction",
} as const

// Indian States and UTs
export const INDIAN_STATES = {
  ANDHRA_PRADESH: "Andhra Pradesh",
  ARUNACHAL_PRADESH: "Arunachal Pradesh",
  ASSAM: "Assam",
  BIHAR: "Bihar",
  CHHATTISGARH: "Chhattisgarh",
  GOA: "Goa",
  GUJARAT: "Gujarat",
  HARYANA: "Haryana",
  HIMACHAL_PRADESH: "Himachal Pradesh",
  JHARKHAND: "Jharkhand",
  KARNATAKA: "Karnataka",
  KERALA: "Kerala",
  MADHYA_PRADESH: "Madhya Pradesh",
  MAHARASHTRA: "Maharashtra",
  MANIPUR: "Manipur",
  MEGHALAYA: "Meghalaya",
  MIZORAM: "Mizoram",
  NAGALAND: "Nagaland",
  ODISHA: "Odisha",
  PUNJAB: "Punjab",
  RAJASTHAN: "Rajasthan",
  SIKKIM: "Sikkim",
  TAMIL_NADU: "Tamil Nadu",
  TELANGANA: "Telangana",
  TRIPURA: "Tripura",
  UTTAR_PRADESH: "Uttar Pradesh",
  UTTARAKHAND: "Uttarakhand",
  WEST_BENGAL: "West Bengal",
  // Union Territories
  ANDAMAN_NICOBAR: "Andaman and Nicobar Islands",
  CHANDIGARH: "Chandigarh",
  DADRA_NAGAR_HAVELI: "Dadra and Nagar Haveli and Daman and Diu",
  DELHI: "Delhi",
  JAMMU_KASHMIR: "Jammu and Kashmir",
  LADAKH: "Ladakh",
  LAKSHADWEEP: "Lakshadweep",
  PUDUCHERRY: "Puducherry",
} as const

// Payment Methods
export const PAYMENT_METHODS = {
  UPI: "upi",
  NET_BANKING: "net_banking",
  DEBIT_CARD: "debit_card",
  CREDIT_CARD: "credit_card",
  WALLET: "wallet",
  EMI: "emi",
  CASH_ON_DELIVERY: "cod",
  BANK_TRANSFER: "bank_transfer",
} as const

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
  PARTIALLY_REFUNDED: "partially_refunded",
} as const

// Order Status
export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  OUT_FOR_DELIVERY: "out_for_delivery",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  RETURNED: "returned",
  REFUNDED: "refunded",
} as const

// Loan Types
export const LOAN_TYPES = {
  WORKING_CAPITAL: "working_capital",
  TERM_LOAN: "term_loan",
  MUDRA_LOAN: "mudra_loan",
  MSME_LOAN: "msme_loan",
  EQUIPMENT_FINANCE: "equipment_finance",
  INVOICE_DISCOUNTING: "invoice_discounting",
  TRADE_FINANCE: "trade_finance",
  EXPORT_CREDIT: "export_credit",
} as const

// Loan Status
export const LOAN_STATUS = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review",
  APPROVED: "approved",
  REJECTED: "rejected",
  DISBURSED: "disbursed",
  ACTIVE: "active",
  CLOSED: "closed",
  DEFAULTED: "defaulted",
} as const

// Document Types
export const DOCUMENT_TYPES = {
  // Business Documents
  GST_CERTIFICATE: "gst_certificate",
  PAN_CARD: "pan_card",
  UDYAM_CERTIFICATE: "udyam_certificate",
  TRADE_LICENSE: "trade_license",
  INCORPORATION_CERTIFICATE: "incorporation_certificate",
  MOA_AOA: "moa_aoa",
  PARTNERSHIP_DEED: "partnership_deed",

  // Financial Documents
  BANK_STATEMENT: "bank_statement",
  ITR: "itr",
  BALANCE_SHEET: "balance_sheet",
  PROFIT_LOSS: "profit_loss",
  CASH_FLOW: "cash_flow",
  AUDIT_REPORT: "audit_report",

  // Identity Documents
  AADHAR_CARD: "aadhar_card",
  PASSPORT: "passport",
  VOTER_ID: "voter_id",
  DRIVING_LICENSE: "driving_license",

  // Property Documents
  PROPERTY_PAPERS: "property_papers",
  RENT_AGREEMENT: "rent_agreement",
  UTILITY_BILL: "utility_bill",
} as const

// File Upload Limits
export const FILE_UPLOAD = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
  allowedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".pdf", ".doc", ".docx", ".xls", ".xlsx"],
} as const

// Notification Types
export const NOTIFICATION_TYPES = {
  ORDER: "order",
  PAYMENT: "payment",
  BUSINESS: "business",
  LOAN: "loan",
  SECURITY: "security",
  MARKETING: "marketing",
  SYSTEM: "system",
} as const

// Notification Channels
export const NOTIFICATION_CHANNELS = {
  IN_APP: "in_app",
  EMAIL: "email",
  SMS: "sms",
  PUSH: "push",
  WHATSAPP: "whatsapp",
} as const

// Feature Flags
export const FEATURES = {
  // Core Features
  DASHBOARD: "dashboard",
  PROFILE_MANAGEMENT: "profile_management",
  DOCUMENT_UPLOAD: "document_upload",

  // Business Features
  BUSINESS_PROFILE: "business_profile",
  GST_INTEGRATION: "gst_integration",
  COMPLIANCE_TRACKING: "compliance_tracking",

  // Marketplace Features
  PRODUCT_CATALOG: "product_catalog",
  ORDER_MANAGEMENT: "order_management",
  VENDOR_MANAGEMENT: "vendor_management",
  INVENTORY_TRACKING: "inventory_tracking",

  // Financial Features
  PAYMENT_PROCESSING: "payment_processing",
  INVOICE_GENERATION: "invoice_generation",
  EXPENSE_TRACKING: "expense_tracking",
  FINANCIAL_REPORTS: "financial_reports",

  // Loan Features
  LOAN_APPLICATION: "loan_application",
  CREDIT_SCORING: "credit_scoring",
  LOAN_TRACKING: "loan_tracking",

  // Analytics Features
  BUSINESS_ANALYTICS: "business_analytics",
  SALES_REPORTS: "sales_reports",
  CUSTOMER_INSIGHTS: "customer_insights",

  // Pro Features
  ADVANCED_ANALYTICS: "advanced_analytics",
  BULK_OPERATIONS: "bulk_operations",
  API_ACCESS: "api_access",
  PRIORITY_SUPPORT: "priority_support",
  CUSTOM_BRANDING: "custom_branding",
} as const

// Analytics Events
export const ANALYTICS_EVENTS = {
  // Page Views
  PAGE_VIEW: "page_view",

  // User Actions
  USER_SIGNUP: "user_signup",
  USER_LOGIN: "user_login",
  USER_LOGOUT: "user_logout",
  PROFILE_UPDATE: "profile_update",

  // Business Actions
  BUSINESS_CREATED: "business_created",
  BUSINESS_VERIFIED: "business_verified",
  DOCUMENT_UPLOADED: "document_uploaded",

  // Marketplace Actions
  PRODUCT_VIEW: "product_view",
  PRODUCT_SEARCH: "product_search",
  ADD_TO_CART: "add_to_cart",
  PURCHASE: "purchase",
  ORDER_PLACED: "order_placed",

  // Payment Actions
  PAYMENT_INITIATED: "payment_initiated",
  PAYMENT_SUCCESS: "payment_success",
  PAYMENT_FAILED: "payment_failed",

  // Loan Actions
  LOAN_APPLICATION_STARTED: "loan_application_started",
  LOAN_APPLICATION_SUBMITTED: "loan_application_submitted",
  LOAN_APPROVED: "loan_approved",

  // Feature Usage
  FEATURE_USED: "feature_used",
  PRO_UPGRADE: "pro_upgrade",
  SUPPORT_CONTACT: "support_contact",
} as const

// Error Codes
export const ERROR_CODES = {
  // Authentication Errors
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  UNAUTHORIZED: "UNAUTHORIZED",
  ACCOUNT_LOCKED: "ACCOUNT_LOCKED",
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",

  // Validation Errors
  VALIDATION_ERROR: "VALIDATION_ERROR",
  REQUIRED_FIELD: "REQUIRED_FIELD",
  INVALID_FORMAT: "INVALID_FORMAT",
  DUPLICATE_ENTRY: "DUPLICATE_ENTRY",

  // Business Errors
  BUSINESS_NOT_FOUND: "BUSINESS_NOT_FOUND",
  BUSINESS_NOT_VERIFIED: "BUSINESS_NOT_VERIFIED",
  INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",

  // Payment Errors
  PAYMENT_FAILED: "PAYMENT_FAILED",
  INSUFFICIENT_FUNDS: "INSUFFICIENT_FUNDS",
  PAYMENT_GATEWAY_ERROR: "PAYMENT_GATEWAY_ERROR",

  // System Errors
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  FILE_UPLOAD_ERROR: "FILE_UPLOAD_ERROR",
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Successfully logged in",
  LOGOUT_SUCCESS: "Successfully logged out",
  PROFILE_UPDATED: "Profile updated successfully",
  BUSINESS_CREATED: "Business profile created successfully",
  DOCUMENT_UPLOADED: "Document uploaded successfully",
  PAYMENT_SUCCESS: "Payment completed successfully",
  ORDER_PLACED: "Order placed successfully",
  LOAN_SUBMITTED: "Loan application submitted successfully",
  EMAIL_SENT: "Email sent successfully",
  PASSWORD_CHANGED: "Password changed successfully",
} as const

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC_ERROR: "Something went wrong. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PHONE: "Please enter a valid phone number",
  INVALID_GST: "Please enter a valid GST number",
  INVALID_PAN: "Please enter a valid PAN number",
  PASSWORD_MISMATCH: "Passwords do not match",
  WEAK_PASSWORD: "Password must be at least 8 characters with uppercase, lowercase, and numbers",
  FILE_TOO_LARGE: "File size must be less than 10MB",
  INVALID_FILE_TYPE: "Invalid file type. Please upload PDF, DOC, or image files",
  REQUIRED_FIELD: "This field is required",
  LOGIN_FAILED: "Invalid email or password",
  ACCOUNT_LOCKED: "Account locked due to multiple failed attempts",
  EMAIL_NOT_VERIFIED: "Please verify your email address",
  BUSINESS_NOT_VERIFIED: "Business verification required",
  INSUFFICIENT_PERMISSIONS: "You don't have permission to perform this action",
  PAYMENT_FAILED: "Payment failed. Please try again",
  ORDER_FAILED: "Failed to place order. Please try again",
} as const

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[6-9]\d{9}$/,
  GST: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  PINCODE: /^[1-9][0-9]{5}$/,
  IFSC: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  AADHAR: /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
} as const

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: "DD MMM YYYY",
  DISPLAY_WITH_TIME: "DD MMM YYYY, hh:mm A",
  API: "YYYY-MM-DD",
  API_WITH_TIME: "YYYY-MM-DD HH:mm:ss",
  RELATIVE: "relative",
} as const

// Currency
export const CURRENCY = {
  CODE: "INR",
  SYMBOL: "₹",
  LOCALE: "en-IN",
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const

// Cache Keys
export const CACHE_KEYS = {
  USER_PROFILE: "user_profile",
  BUSINESS_PROFILE: "business_profile",
  DASHBOARD_DATA: "dashboard_data",
  NOTIFICATIONS: "notifications",
  CATEGORIES: "categories",
  STATES: "states",
} as const

// Cache TTL (Time To Live) in milliseconds
export const CACHE_TTL = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 24 * 60 * 60 * 1000, // 24 hours
} as const

// Environment
export const ENVIRONMENT = {
  DEVELOPMENT: "development",
  STAGING: "staging",
  PRODUCTION: "production",
} as const

// Theme
export const THEME = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const

// Social Media Links
export const SOCIAL_LINKS = {
  FACEBOOK: "https://facebook.com/msmebazaar",
  TWITTER: "https://twitter.com/msmebazaar",
  LINKEDIN: "https://linkedin.com/company/msmebazaar",
  INSTAGRAM: "https://instagram.com/msmebazaar",
  YOUTUBE: "https://youtube.com/msmebazaar",
} as const

// External Links
export const EXTERNAL_LINKS = {
  GST_PORTAL: "https://www.gst.gov.in",
  UDYAM_PORTAL: "https://udyamregistration.gov.in",
  MSME_MINISTRY: "https://msme.gov.in",
  RBI: "https://rbi.org.in",
  SEBI: "https://sebi.gov.in",
} as const

// Export all constants as a single object for convenience
export const CONSTANTS = {
  APP_CONFIG,
  API_CONFIG,
  AUTH_CONFIG,
  USER_ROLES,
  SUBSCRIPTION_PLANS,
  ACCESS_LEVELS,
  BUSINESS_TYPES,
  BUSINESS_CATEGORIES,
  INDIAN_STATES,
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  ORDER_STATUS,
  LOAN_TYPES,
  LOAN_STATUS,
  DOCUMENT_TYPES,
  FILE_UPLOAD,
  NOTIFICATION_TYPES,
  NOTIFICATION_CHANNELS,
  FEATURES,
  ANALYTICS_EVENTS,
  ERROR_CODES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  REGEX_PATTERNS,
  DATE_FORMATS,
  CURRENCY,
  PAGINATION,
  CACHE_KEYS,
  CACHE_TTL,
  ENVIRONMENT,
  THEME,
  SOCIAL_LINKS,
  EXTERNAL_LINKS,
} as const