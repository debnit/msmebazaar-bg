import { z } from "zod"
import { msmeSchema } from "../../../shared/validation/buyer.schema";
export const advancedSearchSchema = z.object({
  query: z.string().min(2),
  filters: z.record(z.string(), z.any()).optional(),
})

export type AdvancedSearchInput = z.infer<typeof advancedSearchSchema>
