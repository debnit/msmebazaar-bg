// /shared/validation/compliance.schema.ts
import { z } from "zod";

export const complianceDocSchema = z.object({
  type: z.string().min(3, "Type is required"),
  documentUrl: z.string().url("Must be a valid URL").optional(),
  status: z.string().optional() // default handled in repo/service
});
