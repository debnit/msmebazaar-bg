import * as repo from "../repositories/listing.repository";

export async function createListing(msmeId: string, data: any) {
  return repo.createListing({ ...data, msmeId });
}
export async function listMsme(msmeId: string) {
  return repo.getListingsByMsme(msmeId);
}
