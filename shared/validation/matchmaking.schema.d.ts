import { z } from "zod";
export declare const matchmakingRequestSchema: z.ZodObject<{
    buyerId: z.ZodString;
    sellerId: z.ZodString;
    score: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    buyerId: string;
    sellerId: string;
    score?: number | undefined;
}, {
    buyerId: string;
    sellerId: string;
    score?: number | undefined;
}>;
//# sourceMappingURL=matchmaking.schema.d.ts.map