-- CreateEnum
CREATE TYPE "ValuationMethod" AS ENUM ('DCF', 'COMPARABLE_COMPANY', 'PRECEDENT_TRANSACTION', 'ASSET_BASED', 'EARNINGS_MULTIPLE', 'REVENUE_MULTIPLE', 'BOOK_VALUE', 'LIQUIDATION_VALUE', 'REPLACEMENT_COST', 'REAL_OPTIONS');

-- CreateEnum
CREATE TYPE "ValuationType" AS ENUM ('ENTERPRISE_VALUE', 'EQUITY_VALUE', 'ASSET_VALUE', 'LIQUIDATION_VALUE', 'GOING_CONCERN');

-- CreateEnum
CREATE TYPE "ValuationPurpose" AS ENUM ('INVESTMENT', 'ACQUISITION', 'MERGER', 'IPO', 'LOAN_SECURITY', 'INSURANCE', 'TAX_PLANNING', 'LEGAL_DISPUTE', 'INTERNAL_PLANNING', 'COMPLIANCE');

-- CreateEnum
CREATE TYPE "ValuationStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'UNDER_REVIEW', 'APPROVED', 'PUBLISHED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AdjustmentType" AS ENUM ('CONTROL_PREMIUM', 'MINORITY_DISCOUNT', 'MARKETABILITY_DISCOUNT', 'KEY_PERSON_DISCOUNT', 'SIZE_PREMIUM', 'COUNTRY_RISK', 'LIQUIDITY_ADJUSTMENT', 'SYNERGY_VALUE', 'OTHER');

-- CreateEnum
CREATE TYPE "AdjustmentImpact" AS ENUM ('POSITIVE', 'NEGATIVE', 'NEUTRAL');

-- CreateEnum
CREATE TYPE "ScenarioType" AS ENUM ('BASE_CASE', 'OPTIMISTIC', 'PESSIMISTIC', 'STRESS_TEST', 'SENSITIVITY');

-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('STARTUP', 'SME', 'LARGE_ENTERPRISE', 'FAMILY_BUSINESS', 'LISTED_COMPANY', 'PARTNERSHIP', 'COOPERATIVE');

-- CreateEnum
CREATE TYPE "MarketDataType" AS ENUM ('MULTIPLE', 'GROWTH_RATE', 'DISCOUNT_RATE', 'RISK_PREMIUM', 'BETA', 'INFLATION_RATE', 'INTEREST_RATE', 'EXCHANGE_RATE');

-- CreateEnum
CREATE TYPE "RequesterType" AS ENUM ('BUSINESS_OWNER', 'INVESTOR', 'BANK', 'LEGAL_FIRM', 'GOVERNMENT', 'INSURANCE_COMPANY', 'CONSULTANT');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('FULL_VALUATION', 'UPDATE_VALUATION', 'PEER_REVIEW', 'OPINION_OF_VALUE', 'DESKTOP_VALUATION');

-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD');

-- CreateTable
CREATE TABLE "business_valuations" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "valuationMethod" "ValuationMethod" NOT NULL,
    "valuationAmount" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "valuationType" "ValuationType" NOT NULL,
    "purpose" "ValuationPurpose" NOT NULL,
    "valuationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "methodology" JSONB NOT NULL,
    "inputData" JSONB NOT NULL,
    "assumptions" JSONB NOT NULL,
    "revenue" DECIMAL(15,2),
    "ebitda" DECIMAL(15,2),
    "netIncome" DECIMAL(15,2),
    "assets" DECIMAL(15,2),
    "liabilities" DECIMAL(15,2),
    "revenueMultiple" DECIMAL(8,4),
    "ebitdaMultiple" DECIMAL(8,4),
    "peRatio" DECIMAL(8,4),
    "confidenceLevel" DECIMAL(5,2) NOT NULL,
    "qualityScore" DECIMAL(3,2),
    "status" "ValuationStatus" NOT NULL DEFAULT 'DRAFT',
    "valuedBy" TEXT NOT NULL,
    "reviewedBy" TEXT,
    "approvedBy" TEXT,
    "reportUrl" TEXT,
    "supportingDocs" TEXT[],
    "reviewNotes" TEXT,
    "approvalNotes" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_valuations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comparable_companies" (
    "id" TEXT NOT NULL,
    "valuationId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "sector" TEXT,
    "country" TEXT NOT NULL,
    "revenue" DECIMAL(15,2) NOT NULL,
    "ebitda" DECIMAL(15,2),
    "netIncome" DECIMAL(15,2),
    "marketCap" DECIMAL(15,2),
    "evRevenue" DECIMAL(8,4),
    "evEbitda" DECIMAL(8,4),
    "peRatio" DECIMAL(8,4),
    "dataSource" TEXT NOT NULL,
    "dataDate" TIMESTAMP(3) NOT NULL,
    "reliability" DECIMAL(3,2) NOT NULL,
    "similarityScore" DECIMAL(5,4),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comparable_companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "valuation_adjustments" (
    "id" TEXT NOT NULL,
    "valuationId" TEXT NOT NULL,
    "adjustmentType" "AdjustmentType" NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "percentage" DECIMAL(5,2),
    "rationale" TEXT NOT NULL,
    "impact" "AdjustmentImpact" NOT NULL,
    "supportingData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "valuation_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "valuation_scenarios" (
    "id" TEXT NOT NULL,
    "valuationId" TEXT NOT NULL,
    "scenarioName" TEXT NOT NULL,
    "scenarioType" "ScenarioType" NOT NULL,
    "description" TEXT,
    "assumptions" JSONB NOT NULL,
    "valuationAmount" DECIMAL(15,2) NOT NULL,
    "probability" DECIMAL(5,2),
    "keyMetrics" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "valuation_scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "valuation_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "industry" TEXT NOT NULL,
    "businessType" "BusinessType" NOT NULL,
    "methods" "ValuationMethod"[],
    "parameters" JSONB NOT NULL,
    "assumptions" JSONB NOT NULL,
    "multiples" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "successRate" DECIMAL(5,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "valuation_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_data" (
    "id" TEXT NOT NULL,
    "dataType" "MarketDataType" NOT NULL,
    "industry" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "value" DECIMAL(15,4) NOT NULL,
    "unit" TEXT,
    "period" TEXT NOT NULL,
    "dataDate" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL,
    "reliability" DECIMAL(3,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "market_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "valuation_requests" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "requesterType" "RequesterType" NOT NULL,
    "businessId" TEXT NOT NULL,
    "requestType" "RequestType" NOT NULL,
    "urgency" "Urgency" NOT NULL DEFAULT 'NORMAL',
    "purpose" "ValuationPurpose" NOT NULL,
    "methods" "ValuationMethod"[],
    "deliverables" TEXT[],
    "deadline" TIMESTAMP(3),
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "assignedTo" TEXT,
    "notes" TEXT,
    "clientNotes" TEXT,
    "valuationId" TEXT,
    "assignedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "valuation_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "valuer_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "designation" TEXT NOT NULL,
    "qualifications" TEXT[],
    "yearsExperience" INTEGER NOT NULL,
    "specializations" TEXT[],
    "certifications" TEXT[],
    "completedValuations" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DECIMAL(3,2),
    "averageTurnaround" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "maxConcurrentValuations" INTEGER NOT NULL DEFAULT 5,
    "preferredMethods" "ValuationMethod"[],
    "preferredIndustries" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "valuer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "valuation_templates_name_key" ON "valuation_templates"("name");

-- CreateIndex
CREATE INDEX "market_data_dataType_industry_region_idx" ON "market_data"("dataType", "industry", "region");

-- CreateIndex
CREATE INDEX "market_data_dataDate_idx" ON "market_data"("dataDate");

-- CreateIndex
CREATE UNIQUE INDEX "valuer_profiles_userId_key" ON "valuer_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "valuer_profiles_licenseNumber_key" ON "valuer_profiles"("licenseNumber");

-- AddForeignKey
ALTER TABLE "comparable_companies" ADD CONSTRAINT "comparable_companies_valuationId_fkey" FOREIGN KEY ("valuationId") REFERENCES "business_valuations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "valuation_adjustments" ADD CONSTRAINT "valuation_adjustments_valuationId_fkey" FOREIGN KEY ("valuationId") REFERENCES "business_valuations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "valuation_scenarios" ADD CONSTRAINT "valuation_scenarios_valuationId_fkey" FOREIGN KEY ("valuationId") REFERENCES "business_valuations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
