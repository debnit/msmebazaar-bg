import { z } from "zod";
export declare const searchRequestSchema: z.ZodObject<{
    userId: z.ZodString;
    query: z.ZodString;
}, "strip", z.ZodTypeAny, {
    query: string;
    userId: string;
}, {
    query: string;
    userId: string;
}>;
//# sourceMappingURL=searchMatchmaking.schema.d.ts.map