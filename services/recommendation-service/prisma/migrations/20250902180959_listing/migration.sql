-- CreateTable
CREATE TABLE "ListingCatalog" (
    "listingId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sector" TEXT,
    "state" TEXT,
    "tags" TEXT[],
    "minTicketInr" INTEGER,
    "maxTicketInr" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListingCatalog_pkey" PRIMARY KEY ("listingId")
);
