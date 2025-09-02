-- CreateEnum
CREATE TYPE "ExitType" AS ENUM ('ACQUISITION', 'MERGER', 'IPO', 'SECONDARY_SALE', 'MANAGEMENT_BUYOUT', 'STRATEGIC_PARTNERSHIP');

-- CreateEnum
CREATE TYPE "ExitStatus" AS ENUM ('DRAFT', 'ACTIVE', 'UNDER_REVIEW', 'LIVE', 'NEGOTIATING', 'COMPLETED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "BidderType" AS ENUM ('INDIVIDUAL_INVESTOR', 'INSTITUTIONAL_INVESTOR', 'STRATEGIC_BUYER', 'PRIVATE_EQUITY', 'VENTURE_CAPITAL', 'CORPORATE');

-- CreateEnum
CREATE TYPE "BidStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN', 'EXPIRED');

-- CreateEnum
CREATE TYPE "NegotiationStatus" AS ENUM ('ACTIVE', 'ACCEPTED', 'REJECTED', 'COUNTERED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ValuationMethod" AS ENUM ('DCF', 'COMPARABLE_COMPANY', 'ASSET_BASED', 'REVENUE_MULTIPLE', 'EBITDA_MULTIPLE', 'RISK_ADJUSTED');

-- CreateTable
CREATE TABLE "exit_opportunities" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "exitType" "ExitType" NOT NULL,
    "targetValuation" DECIMAL(15,2) NOT NULL,
    "minimumOffer" DECIMAL(15,2) NOT NULL,
    "equityPercentage" DECIMAL(5,2),
    "status" "ExitStatus" NOT NULL DEFAULT 'DRAFT',
    "listingDate" TIMESTAMP(3),
    "targetCloseDate" TIMESTAMP(3),
    "actualCloseDate" TIMESTAMP(3),
    "description" TEXT NOT NULL,
    "terms" JSONB,
    "documents" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exit_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exit_bids" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "bidderId" TEXT NOT NULL,
    "bidderType" "BidderType" NOT NULL,
    "offerAmount" DECIMAL(15,2) NOT NULL,
    "equityPercentage" DECIMAL(5,2),
    "conditions" JSONB,
    "status" "BidStatus" NOT NULL DEFAULT 'SUBMITTED',
    "validUntil" TIMESTAMP(3) NOT NULL,
    "dueDiligenceStatus" TEXT,
    "dueDiligenceNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exit_bids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "negotiations" (
    "id" TEXT NOT NULL,
    "bidId" TEXT NOT NULL,
    "round" INTEGER NOT NULL DEFAULT 1,
    "proposedBy" TEXT NOT NULL,
    "counterOffer" DECIMAL(15,2),
    "terms" JSONB,
    "notes" TEXT,
    "status" "NegotiationStatus" NOT NULL DEFAULT 'ACTIVE',
    "respondBy" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "negotiations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exit_activities" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exit_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "valuations" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "method" "ValuationMethod" NOT NULL,
    "value" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "parameters" JSONB NOT NULL,
    "assumptions" JSONB,
    "calculations" JSONB,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "valuedBy" TEXT NOT NULL,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "valuations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "exit_bids" ADD CONSTRAINT "exit_bids_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "exit_opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "negotiations" ADD CONSTRAINT "negotiations_bidId_fkey" FOREIGN KEY ("bidId") REFERENCES "exit_bids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exit_activities" ADD CONSTRAINT "exit_activities_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "exit_opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
