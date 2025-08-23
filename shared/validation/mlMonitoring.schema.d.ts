import { z } from "zod";
export declare const mlJobEventSchema: z.ZodObject<{
    id: z.ZodString;
    service: z.ZodString;
    status: z.ZodString;
    metrics: z.ZodRecord<z.ZodString, z.ZodAny>;
    startedAt: z.ZodOptional<z.ZodString>;
    endedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    service: string;
    status: string;
    id: string;
    metrics: Record<string, any>;
    startedAt?: string | undefined;
    endedAt?: string | undefined;
}, {
    service: string;
    status: string;
    id: string;
    metrics: Record<string, any>;
    startedAt?: string | undefined;
    endedAt?: string | undefined;
}>;
