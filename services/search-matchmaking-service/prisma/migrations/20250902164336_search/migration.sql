-- CreateEnum
CREATE TYPE "SearchType" AS ENUM ('BUSINESS', 'LISTING', 'INVESTMENT', 'BUYER', 'SELLER', 'GENERAL');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('BUSINESS', 'BUYER', 'SELLER', 'INVESTOR', 'LISTING', 'LOAN_REQUEST');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('PENDING', 'VIEWED', 'CONTACTED', 'INTERESTED', 'NOT_INTERESTED', 'MATCHED');

-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('EXCELLENT', 'GOOD', 'AVERAGE', 'POOR', 'IRRELEVANT');

-- CreateEnum
CREATE TYPE "AlgorithmType" AS ENUM ('CONTENT_BASED', 'COLLABORATIVE', 'HYBRID', 'ML_BASED', 'RULE_BASED');

-- CreateEnum
CREATE TYPE "AlgorithmStatus" AS ENUM ('ACTIVE', 'TESTING', 'DEPRECATED', 'INACTIVE');

-- CreateTable
CREATE TABLE "search_queries" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "query" TEXT NOT NULL,
    "filters" JSONB,
    "category" TEXT,
    "location" TEXT,
    "priceRange" JSONB,
    "searchType" "SearchType" NOT NULL,
    "sortBy" TEXT,
    "page" INTEGER NOT NULL DEFAULT 1,
    "limit" INTEGER NOT NULL DEFAULT 20,
    "resultCount" INTEGER,
    "results" JSONB,
    "executionTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_queries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matchmaking_requests" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "requesterType" "EntityType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "requirements" JSONB NOT NULL,
    "preferences" JSONB,
    "budget" DECIMAL(15,2),
    "timeline" TEXT,
    "location" TEXT,
    "matchingCriteria" JSONB NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'ACTIVE',
    "priority" "Priority" NOT NULL DEFAULT 'NORMAL',
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matchmaking_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityType" "EntityType" NOT NULL,
    "entityName" TEXT NOT NULL,
    "matchScore" DECIMAL(5,4) NOT NULL,
    "algorithm" TEXT NOT NULL,
    "confidence" DECIMAL(5,4),
    "matchedCriteria" JSONB NOT NULL,
    "unmatched" JSONB,
    "status" "MatchStatus" NOT NULL DEFAULT 'PENDING',
    "viewedAt" TIMESTAMP(3),
    "contactedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_feedback" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER,
    "feedback" "FeedbackType" NOT NULL,
    "comment" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_index" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityType" "EntityType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tags" TEXT[],
    "categories" TEXT[],
    "metadata" JSONB,
    "searchVector" TEXT,
    "popularity" DECIMAL(5,4),
    "boost" DECIMAL(3,2) NOT NULL DEFAULT 1.0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastIndexed" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_index_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matching_algorithms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "algorithmType" "AlgorithmType" NOT NULL,
    "parameters" JSONB NOT NULL,
    "weights" JSONB NOT NULL,
    "thresholds" JSONB NOT NULL,
    "accuracy" DECIMAL(5,4),
    "precision" DECIMAL(5,4),
    "recall" DECIMAL(5,4),
    "status" "AlgorithmStatus" NOT NULL DEFAULT 'ACTIVE',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matching_algorithms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entity_profiles" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityType" "EntityType" NOT NULL,
    "features" JSONB NOT NULL,
    "preferences" JSONB,
    "constraints" JSONB,
    "interactions" JSONB,
    "feedback" JSONB,
    "popularity" DECIMAL(5,4),
    "reliability" DECIMAL(5,4),
    "responseRate" DECIMAL(5,4),
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "entity_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_analytics" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalQueries" INTEGER NOT NULL DEFAULT 0,
    "uniqueUsers" INTEGER NOT NULL DEFAULT 0,
    "avgResponseTime" DECIMAL(8,2),
    "topQueries" JSONB,
    "topCategories" JSONB,
    "topFilters" JSONB,
    "zeroResultQueries" INTEGER NOT NULL DEFAULT 0,
    "clickThroughRate" DECIMAL(5,4),
    "totalMatches" INTEGER NOT NULL DEFAULT 0,
    "avgMatchScore" DECIMAL(5,4),
    "successRate" DECIMAL(5,4),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "search_queries_userId_idx" ON "search_queries"("userId");

-- CreateIndex
CREATE INDEX "search_queries_searchType_idx" ON "search_queries"("searchType");

-- CreateIndex
CREATE INDEX "search_queries_createdAt_idx" ON "search_queries"("createdAt");

-- CreateIndex
CREATE INDEX "matches_requestId_matchScore_idx" ON "matches"("requestId", "matchScore");

-- CreateIndex
CREATE UNIQUE INDEX "match_feedback_matchId_key" ON "match_feedback"("matchId");

-- CreateIndex
CREATE UNIQUE INDEX "search_index_entityId_key" ON "search_index"("entityId");

-- CreateIndex
CREATE INDEX "search_index_entityType_isActive_idx" ON "search_index"("entityType", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "matching_algorithms_name_key" ON "matching_algorithms"("name");

-- CreateIndex
CREATE UNIQUE INDEX "entity_profiles_entityId_key" ON "entity_profiles"("entityId");

-- CreateIndex
CREATE UNIQUE INDEX "search_analytics_date_key" ON "search_analytics"("date");

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "matchmaking_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_feedback" ADD CONSTRAINT "match_feedback_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
