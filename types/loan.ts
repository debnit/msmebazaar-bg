export interface LoanApplication {
  id: string
  businessId: string
  applicantId: string
  loanType: LoanType
  amount: number
  purpose: LoanPurpose
  tenure: number // in months
  interestRate?: number
  status: LoanApplicationStatus
  stage: LoanProcessingStage
  submittedAt: Date
  updatedAt: Date
  approvedAt?: Date
  disbursedAt?: Date
  rejectedAt?: Date
  rejectionReason?: string
  loanOfficerId?: string
  documents: LoanDocument[]
  businessDetails: BusinessLoanDetails
  financialDetails: FinancialDetails
  collateral?: CollateralDetails[]
  guarantors?: GuarantorDetails[]
  creditScore?: CreditScore
  riskAssessment?: RiskAssessment
  repaymentSchedule?: RepaymentSchedule[]
  metadata: Record<string, any>
}

export enum LoanType {
  WORKING_CAPITAL = "working_capital",
  TERM_LOAN = "term_loan",
  EQUIPMENT_FINANCE = "equipment_finance",
  INVOICE_DISCOUNTING = "invoice_discounting",
  TRADE_FINANCE = "trade_finance",
  MSME_LOAN = "msme_loan",
  MUDRA_LOAN = "mudra_loan",
  STAND_UP_INDIA = "stand_up_india",
  PMEGP = "pmegp",
  CGTMSE = "cgtmse",
}

export enum LoanPurpose {
  BUSINESS_EXPANSION = "business_expansion",
  INVENTORY_PURCHASE = "inventory_purchase",
  EQUIPMENT_PURCHASE = "equipment_purchase",
  WORKING_CAPITAL = "working_capital",
  DEBT_CONSOLIDATION = "debt_consolidation",
  TECHNOLOGY_UPGRADE = "technology_upgrade",
  MARKETING = "marketing",
  EXPORT_FINANCE = "export_finance",
  RAW_MATERIAL = "raw_material",
  INFRASTRUCTURE = "infrastructure",
}

export enum LoanApplicationStatus {
  DRAFT = "draft",
  SUBMITTED = "submitted",
  UNDER_REVIEW = "under_review",
  APPROVED = "approved",
  REJECTED = "rejected",
  DISBURSED = "disbursed",
  CLOSED = "closed",
  DEFAULTED = "defaulted",
}

export enum LoanProcessingStage {
  APPLICATION_RECEIVED = "application_received",
  DOCUMENT_VERIFICATION = "document_verification",
  CREDIT_ASSESSMENT = "credit_assessment",
  FIELD_VERIFICATION = "field_verification",
  TECHNICAL_EVALUATION = "technical_evaluation",
  RISK_ASSESSMENT = "risk_assessment",
  APPROVAL_COMMITTEE = "approval_committee",
  SANCTION_LETTER = "sanction_letter",
  DOCUMENTATION = "documentation",
  DISBURSEMENT = "disbursement",
}

export interface LoanDocument {
  id: string
  type: LoanDocumentType
  name: string
  url: string
  uploadedAt: Date
  verifiedAt?: Date
  verifiedBy?: string
  status: DocumentVerificationStatus
  remarks?: string
  expiryDate?: Date
  isRequired: boolean
}

export enum LoanDocumentType {
  // Business Documents
  BUSINESS_REGISTRATION = "business_registration",
  GST_CERTIFICATE = "gst_certificate",
  PAN_CARD = "pan_card",
  UDYAM_CERTIFICATE = "udyam_certificate",
  PARTNERSHIP_DEED = "partnership_deed",
  MOA_AOA = "moa_aoa",

  // Financial Documents
  BANK_STATEMENTS = "bank_statements",
  ITR = "itr",
  BALANCE_SHEET = "balance_sheet",
  PROFIT_LOSS = "profit_loss",
  CA_CERTIFICATE = "ca_certificate",
  FINANCIAL_PROJECTIONS = "financial_projections",

  // Personal Documents
  AADHAR_CARD = "aadhar_card",
  PASSPORT = "passport",
  DRIVING_LICENSE = "driving_license",
  VOTER_ID = "voter_id",

  // Property Documents
  PROPERTY_PAPERS = "property_papers",
  VALUATION_REPORT = "valuation_report",
  NOC = "noc",

  // Other Documents
  PROJECT_REPORT = "project_report",
  QUOTATIONS = "quotations",
  INSURANCE_POLICY = "insurance_policy",
  EXISTING_LOAN_DETAILS = "existing_loan_details",
}

export enum DocumentVerificationStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  REJECTED = "rejected",
  EXPIRED = "expired",
}

export interface BusinessLoanDetails {
  businessName: string
  businessType: string
  industryType: string
  yearOfEstablishment: number
  numberOfEmployees: number
  annualTurnover: number
  businessAddress: Address
  businessDescription: string
  existingLoans: ExistingLoan[]
  bankingRelationship: BankingRelationship[]
}

export interface FinancialDetails {
  annualRevenue: number
  monthlyRevenue: number
  netProfit: number
  existingEMI: number
  cashFlow: CashFlowDetails
  assets: AssetDetails[]
  liabilities: LiabilityDetails[]
  financialRatios: FinancialRatios
}

export interface CashFlowDetails {
  operatingCashFlow: number
  investingCashFlow: number
  financingCashFlow: number
  netCashFlow: number
  cashFlowProjection: MonthlyProjection[]
}

export interface MonthlyProjection {
  month: number
  year: number
  revenue: number
  expenses: number
  netCashFlow: number
}

export interface AssetDetails {
  type: AssetType
  description: string
  value: number
  acquisitionDate: Date
  depreciationRate?: number
  currentValue: number
}

export enum AssetType {
  CURRENT_ASSETS = "current_assets",
  FIXED_ASSETS = "fixed_assets",
  INTANGIBLE_ASSETS = "intangible_assets",
  INVESTMENTS = "investments",
}

export interface LiabilityDetails {
  type: LiabilityType
  description: string
  amount: number
  interestRate?: number
  maturityDate?: Date
  monthlyPayment?: number
}

export enum LiabilityType {
  CURRENT_LIABILITIES = "current_liabilities",
  LONG_TERM_DEBT = "long_term_debt",
  CONTINGENT_LIABILITIES = "contingent_liabilities",
}

export interface FinancialRatios {
  currentRatio: number
  quickRatio: number
  debtToEquityRatio: number
  returnOnAssets: number
  returnOnEquity: number
  grossProfitMargin: number
  netProfitMargin: number
  interestCoverageRatio: number
}

export interface CollateralDetails {
  id: string
  type: CollateralType
  description: string
  value: number
  valuationDate: Date
  valuedBy: string
  location: Address
  documents: LoanDocument[]
  insuranceDetails?: InsuranceDetails
}

export enum CollateralType {
  REAL_ESTATE = "real_estate",
  MACHINERY = "machinery",
  INVENTORY = "inventory",
  RECEIVABLES = "receivables",
  SECURITIES = "securities",
  GOLD = "gold",
  VEHICLE = "vehicle",
}

export interface InsuranceDetails {
  policyNumber: string
  insurer: string
  coverageAmount: number
  expiryDate: Date
  premiumAmount: number
}

export interface GuarantorDetails {
  id: string
  name: string
  relationship: string
  panNumber: string
  aadharNumber: string
  address: Address
  occupation: string
  annualIncome: number
  netWorth: number
  creditScore?: number
  documents: LoanDocument[]
}

export interface Address {
  street: string
  city: string
  state: string
  pincode: string
  country: string
  landmark?: string
}

export interface ExistingLoan {
  lenderName: string
  loanType: string
  sanctionedAmount: number
  outstandingAmount: number
  emi: number
  interestRate: number
  tenure: number
  startDate: Date
  endDate: Date
}

export interface BankingRelationship {
  bankName: string
  accountType: string
  accountNumber: string
  relationshipDuration: number // in years
  averageBalance: number
  creditFacilities: string[]
}

export interface CreditScore {
  score: number
  bureau: CreditBureau
  reportDate: Date
  factors: CreditFactor[]
}

export enum CreditBureau {
  CIBIL = "cibil",
  EXPERIAN = "experian",
  EQUIFAX = "equifax",
  CRIF = "crif",
}

export interface CreditFactor {
  factor: string
  impact: "positive" | "negative" | "neutral"
  description: string
}

export interface RiskAssessment {
  overallRisk: RiskLevel
  creditRisk: RiskLevel
  businessRisk: RiskLevel
  industryRisk: RiskLevel
  marketRisk: RiskLevel
  operationalRisk: RiskLevel
  riskFactors: RiskFactor[]
  mitigationMeasures: string[]
  recommendedAmount: number
  recommendedTenure: number
  recommendedRate: number
}

export enum RiskLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  VERY_HIGH = "very_high",
}

export interface RiskFactor {
  category: string
  description: string
  severity: RiskLevel
  probability: number
  impact: number
}

export interface RepaymentSchedule {
  installmentNumber: number
  dueDate: Date
  principalAmount: number
  interestAmount: number
  totalAmount: number
  outstandingBalance: number
  status: RepaymentStatus
  paidDate?: Date
  paidAmount?: number
  penaltyAmount?: number
}

export enum RepaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  OVERDUE = "overdue",
  PARTIAL = "partial",
}

// Loan Product Types
export interface LoanProduct {
  id: string
  name: string
  type: LoanType
  description: string
  minAmount: number
  maxAmount: number
  minTenure: number
  maxTenure: number
  interestRateRange: {
    min: number
    max: number
  }
  processingFee: {
    percentage?: number
    fixedAmount?: number
    minAmount?: number
    maxAmount?: number
  }
  eligibilityCriteria: EligibilityCriteria
  requiredDocuments: LoanDocumentType[]
  features: string[]
  benefits: string[]
  isActive: boolean
  targetSegment: string[]
}

export interface EligibilityCriteria {
  minBusinessAge: number // in years
  minAnnualTurnover: number
  minCreditScore?: number
  maxExistingEMI?: number
  industryTypes: string[]
  businessTypes: string[]
  geographicRestrictions?: string[]
  otherCriteria: string[]
}

// Government Scheme Types
export interface GovernmentScheme {
  id: string
  name: string
  type: GovernmentSchemeType
  description: string
  benefits: SchemeBenefit[]
  eligibility: SchemeEligibility
  applicationProcess: ApplicationStep[]
  requiredDocuments: LoanDocumentType[]
  subsidyDetails?: SubsidyDetails
  isActive: boolean
  validFrom: Date
  validTo?: Date
}

export enum GovernmentSchemeType {
  MUDRA = "mudra",
  PMEGP = "pmegp",
  STAND_UP_INDIA = "stand_up_india",
  CGTMSE = "cgtmse",
  MSME_DEVELOPMENT = "msme_development",
  STARTUP_INDIA = "startup_india",
}

export interface SchemeBenefit {
  type: BenefitType
  description: string
  value?: number
  percentage?: number
}

export enum BenefitType {
  SUBSIDY = "subsidy",
  INTEREST_SUBVENTION = "interest_subvention",
  GUARANTEE = "guarantee",
  TAX_BENEFIT = "tax_benefit",
  COLLATERAL_FREE = "collateral_free",
}

export interface SchemeEligibility {
  businessTypes: string[]
  categories: string[] // SC/ST/Women/Minority etc.
  maxProjectCost: number
  minOwnContribution: number
  geographicRestrictions?: string[]
  otherCriteria: string[]
}

export interface ApplicationStep {
  stepNumber: number
  title: string
  description: string
  estimatedTime: string
  requiredDocuments: LoanDocumentType[]
}

export interface SubsidyDetails {
  percentage: number
  maxAmount: number
  disbursementSchedule: SubsidyDisbursement[]
  conditions: string[]
}

export interface SubsidyDisbursement {
  milestone: string
  percentage: number
  amount: number
  requiredDocuments: string[]
}

// Loan Analytics Types
export interface LoanAnalytics {
  totalApplications: number
  approvedApplications: number
  rejectedApplications: number
  disbursedAmount: number
  averageProcessingTime: number
  approvalRate: number
  defaultRate: number
  portfolioHealth: PortfolioHealth
  trendsData: LoanTrend[]
}

export interface PortfolioHealth {
  totalOutstanding: number
  performingAssets: number
  nonPerformingAssets: number
  npaRatio: number
  provisionCoverage: number
}

export interface LoanTrend {
  period: string
  applications: number
  approvals: number
  disbursements: number
  collections: number
}

// API Request/Response Types
export interface CreateLoanApplicationRequest {
  businessId: string
  loanType: LoanType
  amount: number
  purpose: LoanPurpose
  tenure: number
  businessDetails: Partial<BusinessLoanDetails>
  financialDetails: Partial<FinancialDetails>
}

export interface UpdateLoanApplicationRequest {
  status?: LoanApplicationStatus
  stage?: LoanProcessingStage
  documents?: LoanDocument[]
  remarks?: string
  approvedAmount?: number
  approvedTenure?: number
  interestRate?: number
}

export interface LoanApplicationResponse {
  application: LoanApplication
  eligibleProducts: LoanProduct[]
  governmentSchemes: GovernmentScheme[]
  nextSteps: ApplicationStep[]
}

export interface LoanDashboardData {
  applications: LoanApplication[]
  analytics: LoanAnalytics
  recentActivity: LoanActivity[]
  upcomingPayments: RepaymentSchedule[]
}

export interface LoanActivity {
  id: string
  type: ActivityType
  description: string
  timestamp: Date
  userId: string
  applicationId: string
  metadata: Record<string, any>
}

export enum ActivityType {
  APPLICATION_SUBMITTED = "application_submitted",
  DOCUMENT_UPLOADED = "document_uploaded",
  STATUS_CHANGED = "status_changed",
  PAYMENT_MADE = "payment_made",
  REMINDER_SENT = "reminder_sent",
  FIELD_VISIT = "field_visit",
}
