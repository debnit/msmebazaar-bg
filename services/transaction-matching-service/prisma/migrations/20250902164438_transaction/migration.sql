-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('BUYER', 'SELLER', 'INVESTOR', 'BUSINESS', 'FINANCIAL_INSTITUTION', 'MARKETPLACE');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PURCHASE_ORDER', 'INVESTMENT', 'LOAN', 'PARTNERSHIP', 'SERVICE_CONTRACT', 'SUPPLY_AGREEMENT', 'LICENSING', 'JOINT_VENTURE');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACTIVE', 'MATCHED', 'COMPLETED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('PROPOSED', 'VIEWED', 'UNDER_NEGOTIATION', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "NegotiationResponse" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COUNTER_OFFER');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'DISPUTED', 'FAILED');

-- CreateEnum
CREATE TYPE "TransactionStage" AS ENUM ('AGREEMENT', 'IN_PROGRESS', 'REVIEW', 'COMPLETION', 'CLOSED');

-- CreateEnum
CREATE TYPE "MilestoneStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('ADVANCE', 'MILESTONE', 'COMPLETION', 'INSTALLMENT', 'FULL');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED');

-- CreateTable
CREATE TABLE "transaction_requests" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "requesterType" "EntityType" NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "description" TEXT NOT NULL,
    "requirements" JSONB NOT NULL,
    "preferences" JSONB,
    "minAmount" DECIMAL(15,2),
    "maxAmount" DECIMAL(15,2),
    "deadline" TIMESTAMP(3),
    "location" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "Priority" NOT NULL DEFAULT 'NORMAL',
    "expiresAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_matches" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "matchedEntityId" TEXT NOT NULL,
    "matchedEntityType" "EntityType" NOT NULL,
    "matchedRequestId" TEXT,
    "matchScore" DECIMAL(5,4) NOT NULL,
    "confidence" DECIMAL(5,4) NOT NULL,
    "algorithm" TEXT NOT NULL,
    "matchedCriteria" JSONB NOT NULL,
    "unmatchedCriteria" JSONB,
    "proposedAmount" DECIMAL(15,2) NOT NULL,
    "proposedTerms" JSONB,
    "status" "MatchStatus" NOT NULL DEFAULT 'PROPOSED',
    "viewedAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "negotiations" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "round" INTEGER NOT NULL DEFAULT 1,
    "proposedBy" TEXT NOT NULL,
    "proposedToType" "EntityType" NOT NULL,
    "proposedAmount" DECIMAL(15,2),
    "proposedTerms" JSONB,
    "message" TEXT,
    "response" "NegotiationResponse" NOT NULL DEFAULT 'PENDING',
    "responseMessage" TEXT,
    "respondedAt" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "negotiations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "matchId" TEXT,
    "transactionType" "TransactionType" NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "description" TEXT NOT NULL,
    "terms" JSONB NOT NULL,
    "contractUrl" TEXT,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "stage" "TransactionStage" NOT NULL DEFAULT 'AGREEMENT',
    "documents" TEXT[],
    "agreementDate" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
    "expectedEndDate" TIMESTAMP(3),
    "actualEndDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_milestones" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sequence" INTEGER NOT NULL,
    "requirements" JSONB,
    "deliverables" TEXT[],
    "status" "MilestoneStatus" NOT NULL DEFAULT 'PENDING',
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "verificationNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_payments" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "paymentType" "PaymentType" NOT NULL,
    "triggerEvent" TEXT NOT NULL,
    "milestoneId" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "dueDate" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "paymentRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matching_rules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "transactionType" "TransactionType",
    "entityTypes" "EntityType"[],
    "conditions" JSONB NOT NULL,
    "weights" JSONB NOT NULL,
    "thresholds" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "successRate" DECIMAL(5,4),
    "avgMatchScore" DECIMAL(5,4),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matching_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "transaction_matches_requestId_matchScore_idx" ON "transaction_matches"("requestId", "matchScore");

-- CreateIndex
CREATE UNIQUE INDEX "matching_rules_name_key" ON "matching_rules"("name");

-- AddForeignKey
ALTER TABLE "transaction_matches" ADD CONSTRAINT "transaction_matches_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "transaction_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "negotiations" ADD CONSTRAINT "negotiations_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "transaction_matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_milestones" ADD CONSTRAINT "transaction_milestones_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_payments" ADD CONSTRAINT "transaction_payments_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
