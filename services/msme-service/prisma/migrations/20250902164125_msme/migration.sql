-- CreateEnum
CREATE TYPE "MSMEType" AS ENUM ('MICRO', 'SMALL', 'MEDIUM', 'STARTUP');

-- CreateEnum
CREATE TYPE "BusinessCategory" AS ENUM ('MANUFACTURING', 'TRADING', 'SERVICE', 'AGRICULTURE', 'TECHNOLOGY', 'HEALTHCARE', 'EDUCATION', 'CONSTRUCTION', 'TEXTILE', 'FOOD_PROCESSING', 'AUTOMOTIVE', 'CHEMICALS', 'ELECTRONICS', 'RENEWABLE_ENERGY', 'OTHER');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'VERIFIED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "MSMEStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('UDYAM_REGISTRATION', 'GST_CERTIFICATE', 'PAN_CARD', 'INCORPORATION_CERTIFICATE', 'MOA_AOA', 'BANK_STATEMENT', 'ITR', 'FINANCIAL_STATEMENT', 'LICENSE_PERMIT', 'OTHER');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'EXPIRED');

-- CreateTable
CREATE TABLE "msmes" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "legalName" TEXT,
    "gstNumber" TEXT,
    "panNumber" TEXT,
    "cinNumber" TEXT,
    "udyamNumber" TEXT,
    "businessType" "MSMEType" NOT NULL,
    "category" "BusinessCategory" NOT NULL,
    "subcategory" TEXT,
    "establishedDate" TIMESTAMP(3),
    "incorporationDate" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "website" TEXT,
    "annualTurnover" DECIMAL(15,2),
    "employeeCount" INTEGER,
    "exportTurnover" DECIMAL(15,2),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "complianceScore" DECIMAL(3,2),
    "bankingDetails" JSONB,
    "status" "MSMEStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "msmes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_addresses" (
    "id" TEXT NOT NULL,
    "msmeId" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "msme_documents" (
    "id" TEXT NOT NULL,
    "msmeId" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "documentName" TEXT NOT NULL,
    "documentUrl" TEXT NOT NULL,
    "documentNumber" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'SUBMITTED',
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "msme_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "msme_profiles" (
    "id" TEXT NOT NULL,
    "msmeId" TEXT NOT NULL,
    "description" TEXT,
    "mission" TEXT,
    "vision" TEXT,
    "products" JSONB,
    "services" JSONB,
    "certifications" TEXT[],
    "awards" TEXT[],
    "targetMarkets" TEXT[],
    "clientTypes" TEXT[],
    "productionCapacity" TEXT,
    "qualityStandards" TEXT[],
    "logo" TEXT,
    "images" TEXT[],
    "videos" TEXT[],
    "brochures" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "msme_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "msmes_gstNumber_key" ON "msmes"("gstNumber");

-- CreateIndex
CREATE UNIQUE INDEX "msmes_panNumber_key" ON "msmes"("panNumber");

-- CreateIndex
CREATE UNIQUE INDEX "msmes_cinNumber_key" ON "msmes"("cinNumber");

-- CreateIndex
CREATE UNIQUE INDEX "msmes_udyamNumber_key" ON "msmes"("udyamNumber");

-- CreateIndex
CREATE UNIQUE INDEX "business_addresses_msmeId_key" ON "business_addresses"("msmeId");

-- CreateIndex
CREATE UNIQUE INDEX "msme_profiles_msmeId_key" ON "msme_profiles"("msmeId");

-- AddForeignKey
ALTER TABLE "business_addresses" ADD CONSTRAINT "business_addresses_msmeId_fkey" FOREIGN KEY ("msmeId") REFERENCES "msmes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "msme_documents" ADD CONSTRAINT "msme_documents_msmeId_fkey" FOREIGN KEY ("msmeId") REFERENCES "msmes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
