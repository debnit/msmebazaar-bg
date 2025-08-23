import { z } from "zod";
export declare const valuationRequestSchema: z.ZodObject<{
    businessId: z.ZodString;
    metrics: z.ZodObject<{
        turnover: z.ZodNumber;
        profitMargin: z.ZodNumber;
        growthRate: z.ZodOptional<z.ZodNumber>;
        industry: z.ZodOptional<z.ZodString>;
        employees: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        turnover: number;
        profitMargin: number;
        growthRate?: number | undefined;
        industry?: string | undefined;
        employees?: number | undefined;
    }, {
        turnover: number;
        profitMargin: number;
        growthRate?: number | undefined;
        industry?: string | undefined;
        employees?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    businessId: string;
    metrics: {
        turnover: number;
        profitMargin: number;
        growthRate?: number | undefined;
        industry?: string | undefined;
        employees?: number | undefined;
    };
}, {
    businessId: string;
    metrics: {
        turnover: number;
        profitMargin: number;
        growthRate?: number | undefined;
        industry?: string | undefined;
        employees?: number | undefined;
    };
}>;
export type ValuationRequestInput = z.infer<typeof valuationRequestSchema>;
