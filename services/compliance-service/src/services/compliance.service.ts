import * as repo from "../repositories/compliance.repository";

export const createDoc = async (userId: string, data: any) => {
  return repo.createComplianceDoc({ ...data, userId });
};

export const listUserDocs = async (userId: string) => {
  return repo.getComplianceDocsByUser(userId);
};
