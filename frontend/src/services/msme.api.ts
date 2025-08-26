import apiClient, { type ApiResponse } from "./api-client";

export interface CreateMsmePayload {
  gstNumber: string;
  businessName: string;
  address?: string;
}

export interface UpdateMsmePayload {
  gstNumber?: string;
  businessName?: string;
  address?: string;
}

export interface MsmeDto {
  id: string;
  ownerId: string;
  gstNumber: string;
  businessName: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export const msmeApi = {
  create: (payload: CreateMsmePayload) => apiClient.post<ApiResponse<MsmeDto>>("/msme", payload),
  get: (id: string) => apiClient.get<ApiResponse<MsmeDto>>(`/msme/${id}`),
  listMine: () => apiClient.get<ApiResponse<MsmeDto[]>>("/msme/owner/me"),
  update: (id: string, payload: UpdateMsmePayload) => apiClient.put<ApiResponse<MsmeDto>>(`/msme/${id}`, payload),
  remove: (id: string) => apiClient.delete<ApiResponse<{ message: string }>>(`/msme/${id}`),
};
