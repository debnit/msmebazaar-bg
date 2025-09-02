-- CreateTable
CREATE TABLE "Matchmaking" (
    "id" TEXT NOT NULL,
    "msmeId" TEXT NOT NULL,
    "matchedEntityId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Matchmaking_pkey" PRIMARY KEY ("id")
);
