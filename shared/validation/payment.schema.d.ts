import { z } from "zod";
export declare const paymentSchema: z.ZodObject<{
    userId: z.ZodString;
    orderId: z.ZodString;
    status: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
    orderId: string;
    amount: number;
    currency: string;
    status: string;
}, {
    userId: string;
    orderId: string;
    amount: number;
    currency: string;
    status: string;
}>;
