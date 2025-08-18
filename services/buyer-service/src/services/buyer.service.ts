import prisma from "../db/prismaClient"

export async function getBuyerProfile(buyerId: string) {
  return prisma.buyer.findUnique({ where: { id: buyerId } })
}

export async function advancedSearch(query: string, filters?: object) {
  // Simple stub for advanced search logic
  return prisma.recommendation.findMany({
    where: {
      content: { contains: query }
      // add filters as needed
    }
  })
}
