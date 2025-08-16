import { prisma } from "../db/prismaClient";
import type { ComplianceDoc } from "@prisma/client";

export const createComplianceDoc = async (data: {
  userId: string;
  type: string;
  status?: string;
  documentUrl?: string;
}): Promise<ComplianceDoc> => {
  return prisma.complianceDoc.create({
    data: {
      ...data,
      status: data.status ?? "pending"
    }
  });
};

export const getComplianceDocsByUser = async (userId: string): Promise<ComplianceDoc[]> => {
  return prisma.complianceDoc.findMany({ where: { userId } });
};
