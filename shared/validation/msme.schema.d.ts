import { z } from "zod";
export declare const msmeSchema: z.ZodObject<{
    ownerId: z.ZodString;
    gstNumber: z.ZodString;
    businessName: z.ZodString;
    address: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    ownerId: string;
    gstNumber: string;
    businessName: string;
    address?: string | undefined;
}, {
    ownerId: string;
    gstNumber: string;
    businessName: string;
    address?: string | undefined;
}>;
export declare const msmeUpdateSchema: z.ZodObject<{
    ownerId: z.ZodOptional<z.ZodString>;
    gstNumber: z.ZodOptional<z.ZodString>;
    businessName: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    address?: string | undefined;
    ownerId?: string | undefined;
    gstNumber?: string | undefined;
    businessName?: string | undefined;
}, {
    address?: string | undefined;
    ownerId?: string | undefined;
    gstNumber?: string | undefined;
    businessName?: string | undefined;
}>;
