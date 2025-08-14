// /shared/validation/loan.schema.ts
import { z } from "zod";

export const loanCtaSchema = z.object({
  userId: z.string().uuid(),
  loanAmount: z.number().positive(),
  purpose: z.string().min(5),
  tenureMonths: z.number().int().positive()
});

export const loanApplicationSchema = loanCtaSchema.extend({
  documents: z.array(z.string().url()).optional()
});

export type LoanCtaInput = z.infer<typeof loanCtaSchema>;
export type LoanApplicationInput = z.infer<typeof loanApplicationSchema>;
