-- CreateEnum
CREATE TYPE "ModelType" AS ENUM ('CLASSIFICATION', 'REGRESSION', 'CLUSTERING', 'RECOMMENDATION', 'ANOMALY_DETECTION', 'NLP', 'TIME_SERIES');

-- CreateEnum
CREATE TYPE "ModelStatus" AS ENUM ('TRAINING', 'VALIDATION', 'DEPLOYED', 'RETIRED', 'FAILED');

-- CreateEnum
CREATE TYPE "ExperimentStatus" AS ENUM ('RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DriftSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('PERFORMANCE_DEGRADATION', 'DATA_DRIFT', 'MODEL_ERROR', 'SYSTEM_ERROR', 'THRESHOLD_BREACH');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('INFO', 'WARNING', 'ERROR', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('OPEN', 'ACKNOWLEDGED', 'RESOLVED', 'CLOSED');

-- CreateTable
CREATE TABLE "ml_models" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "description" TEXT,
    "modelType" "ModelType" NOT NULL,
    "status" "ModelStatus" NOT NULL DEFAULT 'TRAINING',
    "parameters" JSONB NOT NULL,
    "features" TEXT[],
    "targetMetric" TEXT NOT NULL,
    "accuracy" DECIMAL(5,4),
    "precision" DECIMAL(5,4),
    "recall" DECIMAL(5,4),
    "f1Score" DECIMAL(5,4),
    "endpoint" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ml_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "predictions" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "inputData" JSONB NOT NULL,
    "features" JSONB NOT NULL,
    "prediction" JSONB NOT NULL,
    "confidence" DECIMAL(5,4),
    "entityId" TEXT,
    "entityType" TEXT,
    "requestId" TEXT,
    "responseTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "predictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiments" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ExperimentStatus" NOT NULL DEFAULT 'RUNNING',
    "parameters" JSONB NOT NULL,
    "datasetInfo" JSONB NOT NULL,
    "metrics" JSONB,
    "results" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experiments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_drift" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "driftScore" DECIMAL(5,4) NOT NULL,
    "threshold" DECIMAL(5,4) NOT NULL,
    "severity" "DriftSeverity" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "statistics" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "data_drift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "model_metrics" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "period" TEXT NOT NULL,
    "requestCount" INTEGER NOT NULL DEFAULT 0,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "avgResponseTime" DECIMAL(8,2),
    "accuracy" DECIMAL(5,4),
    "precision" DECIMAL(5,4),
    "recall" DECIMAL(5,4),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "model_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" TEXT NOT NULL,
    "modelId" TEXT,
    "alertType" "AlertType" NOT NULL,
    "severity" "AlertSeverity" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "status" "AlertStatus" NOT NULL DEFAULT 'OPEN',
    "assignedTo" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ml_models_name_key" ON "ml_models"("name");

-- CreateIndex
CREATE UNIQUE INDEX "model_metrics_modelId_date_period_key" ON "model_metrics"("modelId", "date", "period");

-- AddForeignKey
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "ml_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiments" ADD CONSTRAINT "experiments_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "ml_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;
