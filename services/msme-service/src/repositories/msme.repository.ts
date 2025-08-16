import { prisma } from "../db/prismaClient";
import { MSME } from "@prisma/client";

// CREATE
export const createMsme = async (data: Omit<MSME, "id" | "createdAt" | "updatedAt">) => {
  return prisma.mSME.create({ data });
};

// READ by ID
export const getMsmeById = async (id: string) => {
  return prisma.mSME.findUnique({ where: { id } });
};

// READ by owner
export const getMsmeByOwner = async (ownerId: string) => {
  return prisma.mSME.findMany({ where: { ownerId } });
};

// UPDATE
export const updateMsme = async (id: string, data: Partial<MSME>) => {
  return prisma.mSME.update({ where: { id }, data });
};

// DELETE
export const deleteMsme = async (id: string) => {
  return prisma.mSME.delete({ where: { id } });
};
