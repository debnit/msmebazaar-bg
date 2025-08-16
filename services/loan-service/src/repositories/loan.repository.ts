import { prisma } from "../db/prismaClient";
import type { LoanApplication } from "@prisma/client";

export const createLoanApplication = async (data: Omit<LoanApplication, "id" | "createdAt" | "updatedAt">) => {
  return prisma.loanApplication.create({ data });
};

export const getLoanApplicationsByUser = async (userId: string) => {
  return prisma.loanApplication.findMany({ where: { userId } });
};

export const getLoanApplicationById = async (id: string) => {
  return prisma.loanApplication.findUnique({ where: { id } });
};
