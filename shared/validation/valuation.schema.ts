// /shared/validation/valuation.schema.ts
import { z } from "zod";

export const valuationRequestSchema = z.object({
  businessId: z.string().uuid(),
  metrics: z.object({
    turnover: z.number().positive({ message: "Turnover must be positive" }),
    profitMargin: z.number().min(0).max(1),
    growthRate: z.number().optional(),
    industry: z.string().optional(),
    employees: z.number().int().nonnegative().optional()
  })
});

export type ValuationRequestInput = z.infer<typeof valuationRequestSchema>;
