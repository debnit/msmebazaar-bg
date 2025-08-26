import { z } from "zod";
export declare const loanCtaSchema: z.ZodObject<{
    userId: z.ZodString;
    loanAmount: z.ZodNumber;
    purpose: z.ZodString;
    tenureMonths: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    userId: string;
    loanAmount: number;
    purpose: string;
    tenureMonths: number;
}, {
    userId: string;
    loanAmount: number;
    purpose: string;
    tenureMonths: number;
}>;
export declare const loanApplicationSchema: z.ZodObject<{
    userId: z.ZodString;
    loanAmount: z.ZodNumber;
    purpose: z.ZodString;
    tenureMonths: z.ZodNumber;
} & {
    documents: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    loanAmount: number;
    purpose: string;
    tenureMonths: number;
    documents?: string[] | undefined;
}, {
    userId: string;
    loanAmount: number;
    purpose: string;
    tenureMonths: number;
    documents?: string[] | undefined;
}>;
export type LoanCtaInput = z.infer<typeof loanCtaSchema>;
export type LoanApplicationInput = z.infer<typeof loanApplicationSchema>;
//# sourceMappingURL=loan.schema.d.ts.map