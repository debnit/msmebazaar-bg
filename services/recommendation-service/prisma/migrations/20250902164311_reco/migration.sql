-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('VIEW', 'CLICK', 'SEARCH', 'FILTER', 'ADD_TO_CART', 'PURCHASE', 'LIKE', 'SHARE', 'CONTACT_SELLER', 'SAVE_TO_WISHLIST', 'REMOVE_FROM_WISHLIST', 'SESSION_START', 'SESSION_END');

-- CreateEnum
CREATE TYPE "RecommendationType" AS ENUM ('BUSINESS', 'LISTING', 'INVESTMENT', 'LOAN_PRODUCT', 'CATEGORY', 'SELLER');

-- CreateEnum
CREATE TYPE "RecommendationContext" AS ENUM ('HOME_PAGE', 'SEARCH_RESULTS', 'PRODUCT_PAGE', 'CATEGORY_PAGE', 'EMAIL', 'NOTIFICATION', 'PERSONALIZED_FEED');

-- CreateEnum
CREATE TYPE "RecommendationStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'DISMISSED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('LIKE', 'DISLIKE', 'NOT_INTERESTED', 'IRRELEVANT', 'POOR_QUALITY', 'ALREADY_PURCHASED');

-- CreateEnum
CREATE TYPE "MLModelType" AS ENUM ('COLLABORATIVE_FILTERING', 'CONTENT_BASED', 'HYBRID', 'DEEP_LEARNING', 'MATRIX_FACTORIZATION');

-- CreateEnum
CREATE TYPE "ModelStatus" AS ENUM ('TRAINING', 'VALIDATING', 'DEPLOYED', 'DEPRECATED', 'FAILED');

-- CreateTable
CREATE TABLE "user_events" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT,
    "eventType" "EventType" NOT NULL,
    "entityId" TEXT,
    "entityType" TEXT,
    "queryText" TEXT,
    "filters" JSONB,
    "clickPosition" INTEGER,
    "duration" INTEGER,
    "pageUrl" TEXT,
    "referrer" TEXT,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ageGroup" TEXT,
    "location" TEXT,
    "businessType" TEXT,
    "preferredCategories" TEXT[],
    "preferredPriceRange" JSONB,
    "avgSessionDuration" INTEGER,
    "preferredDeviceType" TEXT,
    "activeHours" JSONB,
    "totalEvents" INTEGER NOT NULL DEFAULT 0,
    "totalSessions" INTEGER NOT NULL DEFAULT 0,
    "lastActiveAt" TIMESTAMP(3),
    "engagementScore" DECIMAL(5,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityType" "RecommendationType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "score" DECIMAL(5,4) NOT NULL,
    "algorithm" TEXT NOT NULL,
    "context" "RecommendationContext" NOT NULL,
    "position" INTEGER,
    "isViewed" BOOLEAN NOT NULL DEFAULT false,
    "isClicked" BOOLEAN NOT NULL DEFAULT false,
    "viewedAt" TIMESTAMP(3),
    "clickedAt" TIMESTAMP(3),
    "status" "RecommendationStatus" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_feedback" (
    "id" TEXT NOT NULL,
    "recommendationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER,
    "feedbackType" "FeedbackType" NOT NULL,
    "comment" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_features" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "features" JSONB NOT NULL,
    "categories" TEXT[],
    "tags" TEXT[],
    "popularity" DECIMAL(5,4),
    "trendingScore" DECIMAL(5,4),
    "qualityScore" DECIMAL(5,4),
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_similarities" (
    "id" TEXT NOT NULL,
    "userId1" TEXT NOT NULL,
    "userId2" TEXT NOT NULL,
    "similarity" DECIMAL(5,4) NOT NULL,
    "algorithm" TEXT NOT NULL,
    "basedOn" TEXT[],
    "confidence" DECIMAL(5,4),
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_similarities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ml_models" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "modelType" "MLModelType" NOT NULL,
    "parameters" JSONB NOT NULL,
    "features" TEXT[],
    "accuracy" DECIMAL(5,4),
    "precision" DECIMAL(5,4),
    "recall" DECIMAL(5,4),
    "status" "ModelStatus" NOT NULL DEFAULT 'TRAINING',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "modelPath" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ml_models_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_events_userId_eventType_idx" ON "user_events"("userId", "eventType");

-- CreateIndex
CREATE INDEX "user_events_createdAt_idx" ON "user_events"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_userId_key" ON "user_profiles"("userId");

-- CreateIndex
CREATE INDEX "recommendations_userId_status_idx" ON "recommendations"("userId", "status");

-- CreateIndex
CREATE INDEX "recommendations_createdAt_idx" ON "recommendations"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_feedback_recommendationId_key" ON "user_feedback"("recommendationId");

-- CreateIndex
CREATE UNIQUE INDEX "item_features_entityId_key" ON "item_features"("entityId");

-- CreateIndex
CREATE UNIQUE INDEX "user_similarities_userId1_userId2_algorithm_key" ON "user_similarities"("userId1", "userId2", "algorithm");

-- CreateIndex
CREATE UNIQUE INDEX "ml_models_name_key" ON "ml_models"("name");

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user_profiles"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_feedback" ADD CONSTRAINT "user_feedback_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "recommendations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
