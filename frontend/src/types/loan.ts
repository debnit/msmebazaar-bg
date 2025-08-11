
export interface LoanApplication {
  id: string
  businessId: string
  applicantId: string
  loanType: LoanType
  amount: number
  purpose: LoanPurpose
  tenure: number // in months
  interestRate?: number
  status: LoanStatus
  stage: LoanStage
  priority: LoanPriority
  createdAt: Date
  updatedAt: Date
  submittedAt?: Date
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
  repaymentSchedule?: RepaymentSchedule[]
  disbursementDetails?: DisbursementDetails
  metadata: Record<string, any>
}

export enum LoanType {
  WORKING_CAPITAL = "working_capital",
  TERM_LOAN = "term_loan",
  EQUIPMENT_FINANCE = "equipment_finance",
  INVOICE_DISCOUNTING = "invoice_discounting",
  TRADE_FINANCE = "trade_finance",
  EXPORT_FINANCE = "export_finance",
  MUDRA_LOAN = "mudra_loan",
  MSME_LOAN = "msme_loan",
  STARTUP_LOAN = "startup_loan",
  GOLD_LOAN = "gold_loan",
  PROPERTY_LOAN = "property_loan",
  VEHICLE_LOAN = "vehicle_loan",
}

export enum LoanPurpose {
  BUSINESS_EXPANSION = "business_expansion",
  INVENTORY_PURCHASE = "inventory_purchase",
  EQUIPMENT_PURCHASE = "equipment_purchase",
  WORKING_CAPITAL = "working_capital",
  DEBT_CONSOLIDATION = "debt_consolidation",
  MARKETING = "marketing",
  TECHNOLOGY_UPGRADE = "technology_upgrade",
  EXPORT_ORDERS = "export_orders",
  RAW_MATERIALS = "raw_materials",
  INFRASTRUCTURE = "infrastructure",
  OTHER = "other",
}

export enum LoanStatus {
  DRAFT = "draft",
  SUBMITTED = "submitted",
  UNDER_REVIEW = "under_review",
  APPROVED = "approved",
  REJECTED = "rejected",
  DISBURSED = "disbursed",
  ACTIVE = "active",
  CLOSED = "closed",
  DEFAULTED = "defaulted",
  WRITTEN_OFF = "written_off",
}

export enum LoanStage {
  APPLICATION = "application",
  DOCUMENT_VERIFICATION = "document_verification",
  CREDIT_ASSESSMENT = "credit_assessment",
  FIELD_VERIFICATION = "field_verification",
  APPROVAL_COMMITTEE = "approval_committee",
  LEGAL_VERIFICATION = "legal_verification",
  DISBURSEMENT = "disbursement",
  REPAYMENT = "repayment",
}

export enum LoanPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export interface BusinessLoanDetails {
  businessName: string
  businessType: string
  industryType: string
  yearsInBusiness: number
  numberOfEmployees: number
  annualTurnover: number
  monthlyRevenue: number
  businessAddress: Address
  gstNumber?: string
  panNumber: string
  udyamNumber?: string
  businessRegistrationNumber?: string
  businessModel: string
  majorCustomers?: string[]
  majorSuppliers?: string[]
  seasonality?: SeasonalityInfo
}

export interface FinancialDetails {
  bankStatements: BankStatement[]
  gstReturns?: GSTReturn[]
  itrReturns: ITRReturn[]
  balanceSheets: BalanceSheet[]
  profitLossStatements: ProfitLossStatement[]
  cashFlowStatements?: CashFlowStatement[]
  existingLoans: ExistingLoan[]
  creditScore?: number
  creditHistory?: CreditHistoryItem[]
  monthlyIncome: number
  monthlyExpenses: number
  netWorth: number
  debtToIncomeRatio: number
}

export interface BankStatement {
  id: string
  bankName: string
  accountNumber: string
  accountType: string
  fromDate: Date
  toDate: Date
  openingBalance: number
  closingBalance: number
  averageBalance: number
  totalCredits: number
  totalDebits: number
  bounceCharges: number
  transactions: BankTransaction[]
  uploadedAt: Date
  verifiedAt?: Date
  verificationStatus: DocumentVerificationStatus
}

export interface BankTransaction {
  date: Date
  description: string
  debitAmount?: number
  creditAmount?: number
  balance: number
  category?: TransactionCategory
}

export enum TransactionCategory {
  SALES = "sales",
  PURCHASES = "purchases",
  SALARY = "salary",
  RENT = "rent",
  UTILITIES = "utilities",
  LOAN_EMI = "loan_emi",
  TAX_PAYMENT = "tax_payment",
  INVESTMENT = "investment",
  OTHER = "other",
}

export interface GSTReturn {
  id: string
  period: string
  filingDate: Date
  totalSales: number
  totalPurchases: number
  taxPaid: number
  status: string
  uploadedAt: Date
  verifiedAt?: Date
}

export interface ITRReturn {
  id: string
  assessmentYear: string
  filingDate: Date
  totalIncome: number
  taxableIncome: number
  taxPaid: number
  refundAmount?: number
  uploadedAt: Date
  verifiedAt?: Date
}

export interface BalanceSheet {
  id: string
  financialYear: string
  totalAssets: number
  totalLiabilities: number
  shareholderEquity: number
  currentAssets: number
  currentLiabilities: number
  fixedAssets: number
  longTermLiabilities: number
  uploadedAt: Date
  verifiedAt?: Date
}

export interface ProfitLossStatement {
  id: string
  financialYear: string
  totalRevenue: number
  totalExpenses: number
  grossProfit: number
  netProfit: number
  ebitda: number
  operatingProfit: number
  uploadedAt: Date
  verifiedAt?: Date
}

export interface CashFlowStatement {
  id: string
  financialYear: string
  operatingCashFlow: number
  investingCashFlow: number
  financingCashFlow: number
  netCashFlow: number
  uploadedAt: Date
  verifiedAt?: Date
}

export interface ExistingLoan {
  lenderName: string
  loanType: string
  originalAmount: number
  outstandingAmount: number
  monthlyEMI: number
  interestRate: number
  startDate: Date
  endDate: Date
  status: string
  collateral?: string
}

export interface CreditHistoryItem {
  date: Date
  type: "loan" | "credit_card" | "overdraft"
  amount: number
  status: "paid" | "delayed" | "defaulted"
  daysDelayed?: number
  lenderName: string
}

export interface CollateralDetails {
  id: string
  type: CollateralType
  description: string
  estimatedValue: number
  marketValue?: number
  ownership: OwnershipType
  location?: Address
  documents: LoanDocument[]
  valuationReport?: ValuationReport
  insurance?: InsuranceDetails
  legalStatus: LegalStatus
}

export enum CollateralType {
  PROPERTY = "property",
  VEHICLE = "vehicle",
  MACHINERY = "machinery",
  INVENTORY = "inventory",
  GOLD = "gold",
  SECURITIES = "securities",
  FIXED_DEPOSITS = "fixed_deposits",
  OTHER = "other",
}

export enum OwnershipType {
  SOLE = "sole",
  JOINT = "joint",
  COMPANY = "company",
  PARTNERSHIP = "partnership",
}

export interface ValuationReport {
  valuerId: string
  valuerName: string
  valuationDate: Date
  marketValue: number
  forcedSaleValue: number
  methodology: string
  validityPeriod: number // in months
  reportDocument: LoanDocument
}

export interface InsuranceDetails {
  policyNumber: string
  insurerName: string
  policyType: string
  coverageAmount: number
  premiumAmount: number
  startDate: Date
  endDate: Date
  beneficiary: string
  status: string
}

export enum LegalStatus {
  CLEAR = "clear",
  PENDING = "pending",
  DISPUTED = "disputed",
  ENCUMBERED = "encumbered",
}

export interface GuarantorDetails {
  id: string
  name: string
  relationship: string
  panNumber: string
  aadharNumber: string
  address: Address
  phoneNumber: string
  email: string
  occupation: string
  monthlyIncome: number
  netWorth: number
  creditScore?: number
  documents: LoanDocument[]
  consentGiven: boolean
  consentDate?: Date
}

export interface LoanDocument {
  id: string
  type: DocumentType
  name: string
  description?: string
  fileUrl: string
  fileSize: number
  mimeType: string
  uploadedAt: Date
  uploadedBy: string
  verificationStatus: DocumentVerificationStatus
  verifiedAt?: Date
  verifiedBy?: string
  expiryDate?: Date
  isRequired: boolean
  category: DocumentCategory
}

export enum DocumentType {
  // Identity Documents
  PAN_CARD = "pan_card",
  AADHAR_CARD = "aadhar_card",
  PASSPORT = "passport",
  DRIVING_LICENSE = "driving_license",
  VOTER_ID = "voter_id",

  // Business Documents
  BUSINESS_REGISTRATION = "business_registration",
  GST_CERTIFICATE = "gst_certificate",
  UDYAM_CERTIFICATE = "udyam_certificate",
  TRADE_LICENSE = "trade_license",
  PARTNERSHIP_DEED = "partnership_deed",
  MOA_AOA = "moa_aoa",

  // Financial Documents
  BANK_STATEMENT = "bank_statement",
  ITR_RETURN = "itr_return",
  GST_RETURN = "gst_return",
  BALANCE_SHEET = "balance_sheet",
  PROFIT_LOSS = "profit_loss",
  CASH_FLOW = "cash_flow",
  AUDIT_REPORT = "audit_report",

  // Property Documents
  PROPERTY_PAPERS = "property_papers",
  VALUATION_REPORT = "valuation_report",
  INSURANCE_POLICY = "insurance_policy",

  // Other Documents
  PHOTOGRAPH = "photograph",
  SIGNATURE = "signature",
  CANCELLED_CHEQUE = "cancelled_cheque",
  SALARY_SLIP = "salary_slip",
  FORM_16 = "form_16",
  OTHER = "other",
}

export enum DocumentVerificationStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  REJECTED = "rejected",
  EXPIRED = "expired",
  RESUBMISSION_REQUIRED = "resubmission_required",
}

export enum DocumentCategory {
  IDENTITY = "identity",
  BUSINESS = "business",
  FINANCIAL = "financial",
  COLLATERAL = "collateral",
  GUARANTOR = "guarantor",
  OTHER = "other",
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
  lateFee?: number
  daysOverdue?: number
}

export enum RepaymentStatus {
  UPCOMING = "upcoming",
  DUE = "due",
  PAID = "paid",
  PARTIAL = "partial",
  OVERDUE = "overdue",
  WAIVED = "waived",
}

export interface DisbursementDetails {
  disbursementDate: Date
  disbursedAmount: number
  disbursementMethod: DisbursementMethod
  bankAccount: BankAccountDetails
  processingFee: number
  stampDuty: number
  otherCharges: number
  netDisbursement: number
  disbursementReference: string
  status: DisbursementStatus
}

export enum DisbursementMethod {
  NEFT = "neft",
  RTGS = "rtgs",
  IMPS = "imps",
  CHEQUE = "cheque",
  DEMAND_DRAFT = "demand_draft",
}

export interface BankAccountDetails {
  accountNumber: string
  ifscCode: string
  bankName: string
  branchName: string
  accountHolderName: string
  accountType: string
}

export enum DisbursementStatus {
  PENDING = "pending",
  PROCESSED = "processed",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export interface SeasonalityInfo {
  peakMonths: number[]
  lowMonths: number[]
  seasonalityFactor: number
  description: string
}

export interface Address {
  street: string
  city: string
  state: string
  pincode: string
  country: string
  landmark?: string
}

// Loan Analytics Types
export interface LoanAnalytics {
  totalApplications: number
  approvedApplications: number
  rejectedApplications: number
  disbursedAmount: number
  averageLoanAmount: number
  averageProcessingTime: number // in days
  approvalRate: number
  defaultRate: number
  portfolioHealth: PortfolioHealth
  monthlyTrends: MonthlyLoanTrend[]
  loanTypeDistribution: LoanTypeDistribution[]
  riskDistribution: RiskDistribution[]
}

export interface PortfolioHealth {
  totalOutstanding: number
  currentLoans: number
  overdueLoans: number
  npaLoans: number
  npaPercentage: number
  provisionRequired: number
}

export interface MonthlyLoanTrend {
  month: string
  applications: number
  approvals: number
  disbursements: number
  collections: number
}

export interface LoanTypeDistribution {
  loanType: LoanType
  count: number
  amount: number
  percentage: number
}

export interface RiskDistribution {
  riskCategory: RiskCategory
  count: number
  amount: number
  percentage: number
}

export enum RiskCategory {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  VERY_HIGH = "very_high",
}

// Loan Officer Types
export interface LoanOfficer {
  id: string
  name: string
  email: string
  phoneNumber: string
  employeeId: string
  designation: string
  department: string
  branch?: string
  specialization: LoanType[]
  maxLoanLimit: number
  activeLoans: number
  completedLoans: number
  approvalAuthority: boolean
  createdAt: Date
  updatedAt: Date
}

// Loan Product Types
export interface LoanProduct {
  id: string
  name: string
  description: string
  loanType: LoanType
  minAmount: number
  maxAmount: number
  minTenure: number // in months
  maxTenure: number // in months
  interestRateMin: number
  interestRateMax: number
  processingFeePercentage: number
  eligibilityCriteria: EligibilityCriteria
  requiredDocuments: DocumentType[]
  features: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface EligibilityCriteria {
  minAge: number
  maxAge: number
  minBusinessVintage: number // in months
  minAnnualTurnover: number
  minCreditScore?: number
  maxExistingEMI?: number
  businessTypes: string[]
  excludedBusinessTypes?: string[]
  geographicRestrictions?: string[]
}

// API Response Types
export interface LoanApplicationResponse {
  success: boolean
  data?: LoanApplication
  error?: string
  validationErrors?: Record<string, string[]>
}

export interface LoanListResponse {
  success: boolean
  data?: {
    loans: LoanApplication[]
    total: number
    page: number
    limit: number
    hasMore: boolean
  }
  error?: string
}

export interface LoanAnalyticsResponse {
  success: boolean
  data?: LoanAnalytics
  error?: string
}

// Form Types
export interface LoanApplicationForm {
  loanType: LoanType
  amount: number
  purpose: LoanPurpose
  tenure: number
  businessDetails: Partial<BusinessLoanDetails>
  applicantDetails: ApplicantDetails
  financialDetails: Partial<FinancialDetails>
  collateral?: Partial<CollateralDetails>[]
  guarantors?: Partial<GuarantorDetails>[]
}

export interface ApplicantDetails {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  dateOfBirth: Date
  panNumber: string
  aadharNumber: string
  address: Address
  maritalStatus: string
  qualification: string
  experience: number
}

// Webhook Types
export interface LoanWebhookEvent {
  eventType: LoanEventType
  loanId: string
  timestamp: Date
  data: Record<string, any>
  source: string
}

export enum LoanEventType {
  APPLICATION_SUBMITTED = "application_submitted",
  DOCUMENTS_UPLOADED = "documents_uploaded",
  VERIFICATION_COMPLETED = "verification_completed",
  LOAN_APPROVED = "loan_approved",
  LOAN_REJECTED = "loan_rejected",
  LOAN_DISBURSED = "loan_disbursed",
  PAYMENT_RECEIVED = "payment_received",
  PAYMENT_OVERDUE = "payment_overdue",
  LOAN_CLOSED = "loan_closed",
}
