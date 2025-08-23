import { z } from "zod";
export declare const sellerSchema: z.ZodObject<{
    userId: z.ZodString;
    productCatalog: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    productCatalog?: string[] | undefined;
}, {
    userId: string;
    productCatalog?: string[] | undefined;
}>;
