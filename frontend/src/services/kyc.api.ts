"use client";

import apiClient, { type ApiResponse } from "./api-client";

export interface KycUploadPayload {
  panNumber: string;
  gstNumber?: string;
  panDocument: File;
  gstDocument?: File;
}

export const kycApi = {
  uploadKyc: async (payload: KycUploadPayload): Promise<ApiResponse<any>> => {
    const form = new FormData();
    form.append("panNumber", payload.panNumber);
    if (payload.gstNumber) form.append("gstNumber", payload.gstNumber);
    form.append("panDocument", payload.panDocument);
    if (payload.gstDocument) form.append("gstDocument", payload.gstDocument);
    return apiClient.post("/userprofileservice/user/kyc", form as any);
  },
};
