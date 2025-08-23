import { z } from "zod";
export declare const createPaymentOrderSchema: z.ZodObject<{
    amount: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
    planId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    currency: string;
    planId?: string | undefined;
}, {
    amount: number;
    currency?: string | undefined;
    planId?: string | undefined;
}>;
export declare const verifyPaymentSchema: z.ZodObject<{
    razorpayPaymentId: z.ZodString;
    razorpayOrderId: z.ZodString;
    razorpaySignature: z.ZodString;
}, "strip", z.ZodTypeAny, {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}, {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}>;
export type CreatePaymentOrderInput = z.infer<typeof createPaymentOrderSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
