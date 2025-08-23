import { z } from "zod";
export declare const recommendationRequestSchema: z.ZodObject<{
    filters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    limit: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit?: number | undefined;
    filters?: Record<string, any> | undefined;
}, {
    limit?: number | undefined;
    filters?: Record<string, any> | undefined;
}>;
