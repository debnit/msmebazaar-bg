import { z } from "zod";
export declare const transactionMatchSchema: z.ZodObject<{
    transaction1: z.ZodString;
    transaction2: z.ZodString;
    score: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    score: number;
    transaction1: string;
    transaction2: string;
}, {
    score: number;
    transaction1: string;
    transaction2: string;
}>;
