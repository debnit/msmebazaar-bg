// Business and MSME specific types for MSMEBazaar

export enum BusinessType {
  SOLE_PROPRIETORSHIP = "sole_proprietorship",
  PARTNERSHIP = "partnership",
  PRIVATE_LIMITED = "private_limited",
  PUBLIC_LIMITED = "public_limited",
  LLP = "llp", // Limited Liability Partnership
  OPC = "opc", // One Person Company
  TRUST = "trust",
  SOCIETY = "society",
  COOPERATIVE = "cooperative",
}

export enum BusinessSize {
  MICRO = "micro",
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}

export enum IndustryType {
  MANUFACTURING = "manufacturing",
  TRADING = "trading",
  SERVICES = "services",
  RETAIL = "retail",
  WHOLESALE = "wholesale",
  AGRICULTURE = "agriculture",
  TEXTILE = "textile",
  FOOD_PROCESSING = "food_processing",
  HANDICRAFTS = "handicrafts",
  TECHNOLOGY = "technology",
  HEALTHCARE = "healthcare",
  EDUCATION = "education",
  CONSTRUCTION = "construction",
  AUTOMOTIVE = "automotive",
  CHEMICALS = "chemicals",
  PHARMACEUTICALS = "pharmaceuticals",
  ELECTRONICS = "electronics",
  FURNITURE = "furniture",
  JEWELRY = "jewelry",
  LEATHER = "leather",
  PAPER = "paper",
  PLASTIC = "plastic",
  STEEL = "steel",
  OTHER = "other",
}

export enum BusinessStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  UNDER_REVIEW = "under_review",
  VERIFIED = "verified",
  REJECTED = "rejected",
}

export enum VerificationStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  VERIFIED = "verified",
  REJECTED = "rejected",
  EXPIRED = "expired",
}

// Core Business Profile
export interface BusinessProfile {
  id: string
  userId: string
  businessName: string
  legalName: string
  businessType: BusinessType
  businessSize: BusinessSize
  industryType: IndustryType
  status: BusinessStatus

  // Basic Information
  description?: string
  website?: string
  email: string
  phone: string
  alternatePhone?: string

  // Address Information
  address: BusinessAddress

  // Registration Details
  registrationDetails: BusinessRegistration

  // Financial Information
  financialInfo?: BusinessFinancialInfo

  // Verification
  verificationStatus: VerificationStatus
  verifiedAt?: Date
  verificationDocuments: VerificationDocument[]

  // Metadata
  establishedYear?: number
  employeeCount?: number
  annualTurnover?: number
  tags?: string[]
  metadata?: Record<string, any>

  // Timestamps
  createdAt: Date
  updatedAt: Date
}

export interface BusinessAddress {
  street: string
  area?: string
  city: string
  district?: string
  state: string
  pincode: string
  country: string
  landmark?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

export interface BusinessRegistration {
  // GST Details
  gstin?: string
  gstRegistrationDate?: Date
  gstStatus?: "registered" | "unregistered" | "cancelled"

  // PAN Details
  pan: string
  panVerified: boolean

  // Other Registrations
  cin?: string // Corporate Identification Number
  llpin?: string // LLP Identification Number
  udyamNumber?: string // Udyam Registration Number
  iecCode?: string // Import Export Code
  fssaiLicense?: string // Food Safety License
  drugLicense?: string // Drug License

  // Trade License
  tradeLicense?: string
  tradeLicenseExpiry?: Date

  // Professional Tax
  professionalTaxNumber?: string

  // ESI & PF
  esiNumber?: string
  pfNumber?: string

  // Custom registrations
  customRegistrations?: Array<{
    type: string
    number: string
    issuedBy: string
    issuedDate?: Date
    expiryDate?: Date
  }>
}

export interface BusinessFinancialInfo {
  bankDetails: BankDetails[]
  creditRating?: string
  creditScore?: number
  annualTurnover?: number
  monthlyRevenue?: number
  profitMargin?: number
  taxFilingStatus: "regular" | "composition" | "nil_return"
  lastAuditDate?: Date
  financialYear: string
}

export interface BankDetails {
  id: string
  bankName: string
  accountNumber: string
  ifscCode: string
  accountType: "savings" | "current" | "cc" | "od"
  branchName: string
  branchAddress?: string
  isPrimary: boolean
  isVerified: boolean
  verifiedAt?: Date
}

// Document Management
export enum DocumentType {
  PAN_CARD = "pan_card",
  GST_CERTIFICATE = "gst_certificate",
  TRADE_LICENSE = "trade_license",
  UDYAM_CERTIFICATE = "udyam_certificate",
  BANK_STATEMENT = "bank_statement",
  CANCELLED_CHEQUE = "cancelled_cheque",
  INCORPORATION_CERTIFICATE = "incorporation_certificate",
  PARTNERSHIP_DEED = "partnership_deed",
  MOA_AOA = "moa_aoa",
  FSSAI_LICENSE = "fssai_license",
  DRUG_LICENSE = "drug_license",
  POLLUTION_CERTIFICATE = "pollution_certificate",
  FIRE_SAFETY_CERTIFICATE = "fire_safety_certificate",
  SHOP_ESTABLISHMENT = "shop_establishment",
  FACTORY_LICENSE = "factory_license",
  IEC_CERTIFICATE = "iec_certificate",
  EXPORT_LICENSE = "export_license",
  IMPORT_LICENSE = "import_license",
  ISO_CERTIFICATE = "iso_certificate",
  QUALITY_CERTIFICATE = "quality_certificate",
  OTHER = "other",
}

export interface VerificationDocument {
  id: string
  type: DocumentType
  name: string
  description?: string
  fileUrl: string
  fileSize: number
  mimeType: string
  status: VerificationStatus
  uploadedAt: Date
  verifiedAt?: Date
  expiryDate?: Date
  rejectionReason?: string
  metadata?: Record<string, any>
}

// Business Categories and Classifications
export interface BusinessCategory {
  id: string
  name: string
  description?: string
  parentId?: string
  level: number
  industryType: IndustryType
  hsnCodes?: string[]
  applicableLicenses?: string[]
  taxImplications?: string[]
  isActive: boolean
}

export interface BusinessSubcategory {
  id: string
  categoryId: string
  name: string
  description?: string
  keywords?: string[]
  isActive: boolean
}

// MSME Specific Types
export interface MSMEClassification {
  category: "micro" | "small" | "medium"
  criteria: {
    investment: number
    turnover: number
  }
  eligibleSchemes: string[]
  benefits: string[]
  lastUpdated: Date
}

export interface GovernmentScheme {
  id: string
  name: string
  description: string
  eligibilityCriteria: string[]
  benefits: string[]
  applicationProcess: string[]
  requiredDocuments: DocumentType[]
  applicationDeadline?: Date
  contactDetails?: {
    department: string
    phone?: string
    email?: string
    website?: string
  }
  isActive: boolean
}

// Business Analytics
export interface BusinessAnalytics {
  businessId: string
  period: {
    start: Date
    end: Date
  }
  metrics: {
    totalRevenue: number
    totalOrders: number
    averageOrderValue: number
    customerCount: number
    repeatCustomerRate: number
    conversionRate: number
    profitMargin: number
  }
  trends: {
    revenueGrowth: number
    orderGrowth: number
    customerGrowth: number
  }
  topProducts?: Array<{
    productId: string
    name: string
    revenue: number
    quantity: number
  }>
  topCustomers?: Array<{
    customerId: string
    name: string
    totalSpent: number
    orderCount: number
  }>
}

// Business Compliance
export interface ComplianceRequirement {
  id: string
  name: string
  description: string
  applicableBusinessTypes: BusinessType[]
  applicableIndustries: IndustryType[]
  frequency: "monthly" | "quarterly" | "annually" | "one_time"
  dueDate?: Date
  penalty?: string
  requiredDocuments: DocumentType[]
  isActive: boolean
}

export interface ComplianceStatus {
  businessId: string
  requirementId: string
  status: "compliant" | "non_compliant" | "pending" | "not_applicable"
  lastUpdated: Date
  nextDueDate?: Date
  documents?: string[]
  notes?: string
}

// Business Network and Partnerships
export interface BusinessPartnership {
  id: string
  businessId: string
  partnerBusinessId: string
  partnershipType: "supplier" | "distributor" | "retailer" | "service_provider" | "joint_venture"
  status: "active" | "inactive" | "pending" | "terminated"
  startDate: Date
  endDate?: Date
  terms?: string
  contactPerson?: {
    name: string
    designation: string
    phone: string
    email: string
  }
  metadata?: Record<string, any>
}

// Business Reviews and Ratings
export interface BusinessReview {
  id: string
  businessId: string
  reviewerId: string
  reviewerName: string
  rating: number // 1-5
  title?: string
  comment?: string
  pros?: string[]
  cons?: string[]
  wouldRecommend: boolean
  verifiedPurchase: boolean
  helpfulCount: number
  createdAt: Date
  updatedAt: Date
}

export interface BusinessRating {
  businessId: string
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
  lastUpdated: Date
}

// Business Notifications
export interface BusinessNotification {
  id: string
  businessId: string
  type: "compliance" | "payment" | "order" | "review" | "system" | "promotion"
  title: string
  message: string
  priority: "low" | "medium" | "high" | "urgent"
  read: boolean
  actionRequired: boolean
  actionUrl?: string
  expiresAt?: Date
  createdAt: Date
}

// Business Settings
export interface BusinessSettings {
  businessId: string
  general: {
    timezone: string
    currency: string
    language: string
    dateFormat: string
    numberFormat: string
  }
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
    orderUpdates: boolean
    paymentReminders: boolean
    complianceAlerts: boolean
    marketingEmails: boolean
  }
  privacy: {
    profileVisibility: "public" | "private" | "verified_only"
    contactInfoVisible: boolean
    showInDirectory: boolean
    allowReviews: boolean
  }
  integrations: {
    accountingSoftware?: string
    inventoryManagement?: string
    crmSystem?: string
    paymentGateway?: string[]
    shippingPartners?: string[]
  }
}

// Export utility types
export type BusinessId = string
export type BusinessMap = Record<BusinessId, BusinessProfile>
export type IndustryMap = Record<IndustryType, BusinessCategory[]>

// API Response Types
export interface BusinessResponse {
  success: boolean
  business?: BusinessProfile
  error?: string
  message?: string
}

export interface BusinessListResponse {
  success: boolean
  businesses: BusinessProfile[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters?: Record<string, any>
}

export interface BusinessAnalyticsResponse {
  success: boolean
  analytics?: BusinessAnalytics
  error?: string
  message?: string
}
