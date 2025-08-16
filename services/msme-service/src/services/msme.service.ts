import * as repo from "../repositories/msme.repository";

// BUSINESS RULE: Only one MSME per owner with same GST
export async function createMsme(data) {
  const exists = await repo.getMsmeByOwner(data.ownerId);
  if (exists.some((msme) => msme.gstNumber === data.gstNumber)) {
    throw new Error("MSME with this GST number already exists for owner.");
  }
  return repo.createMsme(data);
}

export async function getMsme(id: string) {
  return repo.getMsmeById(id);
}

export async function getMsmesByOwner(ownerId: string) {
  return repo.getMsmeByOwner(ownerId);
}

export async function updateMsme(id: string, data: any) {
  return repo.updateMsme(id, data);
}

export async function deleteMsme(id: string) {
  return repo.deleteMsme(id);
}
