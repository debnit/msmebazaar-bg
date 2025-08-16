import { prisma } from "../db/prismaClient";
import { MLJob } from "@prisma/client";

export const createMLJob = async (data: {
  service: string;
  metrics: any;
  status: string;
  startedAt?: Date;
  endedAt?: Date;
}): Promise<MLJob> => {
  return prisma.mLJob.create({ data });
};

export const updateMLJob = async (
  id: string,
  data: Partial<{ status: string; metrics: any; endedAt: Date }>
): Promise<MLJob | null> => {
  return prisma.mLJob.update({ where: { id }, data });
};

export const listMLJobs = async (filter?: { status?: string }): Promise<MLJob[]> => {
  return prisma.mLJob.findMany({
    where: filter,
    orderBy: { startedAt: "desc" }
  });
};

export const getMLJobById = async (id: string): Promise<MLJob | null> => {
  return prisma.mLJob.findUnique({ where: { id } });
};
