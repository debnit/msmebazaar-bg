import { z } from "zod";
export declare const buyerSchema: z.ZodObject<{
    userId: z.ZodString;
    preference: z.ZodRecord<z.ZodString, z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    preference: Record<string, any>;
}, {
    userId: string;
    preference: Record<string, any>;
}>;
