import { z } from "zod";
export declare const paymentSchema: z.ZodObject<{
    userId: z.ZodString;
    orderId: z.ZodString;
    status: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: string;
    userId: string;
    amount: number;
    currency: string;
    orderId: string;
}, {
    status: string;
    userId: string;
    amount: number;
    currency: string;
    orderId: string;
}>;
//# sourceMappingURL=payment.schema.d.ts.map