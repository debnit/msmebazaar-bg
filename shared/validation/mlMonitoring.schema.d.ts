import { z } from "zod";
export declare const mlJobEventSchema: z.ZodObject<{
    id: z.ZodString;
    service: z.ZodString;
    status: z.ZodString;
    metrics: z.ZodRecord<z.ZodString, z.ZodAny>;
    startedAt: z.ZodOptional<z.ZodString>;
    endedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: string;
    metrics: Record<string, any>;
    service: string;
    startedAt?: string | undefined;
    endedAt?: string | undefined;
}, {
    id: string;
    status: string;
    metrics: Record<string, any>;
    service: string;
    startedAt?: string | undefined;
    endedAt?: string | undefined;
}>;
//# sourceMappingURL=mlMonitoring.schema.d.ts.map