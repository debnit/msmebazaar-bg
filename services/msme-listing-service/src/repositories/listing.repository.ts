import { prisma } from "../db/prismaClient";
import type { Listing } from "@prisma/client";

export const createListing = async (data: Omit<Listing, "id">) => {
  return prisma.listing.create({ data });
};

export const getListingsByMsme = async (msmeId: string) => {
  return prisma.listing.findMany({ where: { msmeId } });
};
