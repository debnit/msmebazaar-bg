import { z } from "zod";
export declare const searchRequestSchema: z.ZodObject<{
    userId: z.ZodString;
    query: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
    query: string;
}, {
    userId: string;
    query: string;
}>;
