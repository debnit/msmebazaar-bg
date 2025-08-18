// services/recommendation-service/src/services/listings.ts

import prisma from "../db/prismaClient";

export async function fetchCandidateListings(filters: {
  sector?: string;
  state?: string;
  tags?: string[];
  limit?: number;
}) {
  const where: any = { status: "active" };
  if (filters.sector) where.sector = filters.sector;
  if (filters.state) where.state = filters.state;
  if (filters.tags && filters.tags.length > 0) {
    where.tags = { hasSome: filters.tags };
  }

  const listings = await prisma.listingCatalog.findMany({
    where,
    take: filters.limit || 50,
    orderBy: {
      createdAt: "desc",
    },
  });

  return listings.map((l) => ({
    listingId: l.listingId,
    title: l.title,
    description: l.description,
    sector: l.sector,
    state: l.state,
    tags: l.tags,
    minTicketInr: l.minTicketInr,
    maxTicketInr: l.maxTicketInr,
  }));
}
