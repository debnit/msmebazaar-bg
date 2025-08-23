import { z } from "zod";
export declare const listingSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    description: string;
    title: string;
}, {
    description: string;
    title: string;
}>;
