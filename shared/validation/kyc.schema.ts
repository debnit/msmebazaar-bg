import { z } from "zod";

export const kycUploadSchema = z.object({
  panNumber: z.string().min(10).max(10),
  gstNumber: z.string().min(10).max(15).optional().or(z.literal("")),
});

export type KycUploadInput = z.infer<typeof kycUploadSchema>;
