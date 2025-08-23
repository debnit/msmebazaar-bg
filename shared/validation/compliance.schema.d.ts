import { z } from "zod";
export declare const complianceDocSchema: z.ZodObject<{
    type: z.ZodString;
    documentUrl: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: string;
    status?: string | undefined;
    documentUrl?: string | undefined;
}, {
    type: string;
    status?: string | undefined;
    documentUrl?: string | undefined;
}>;
