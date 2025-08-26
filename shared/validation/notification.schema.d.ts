import { z } from "zod";
export declare const notificationSchema: z.ZodObject<{
    type: z.ZodString;
    message: z.ZodString;
    read: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    message: string;
    type: string;
    read?: boolean | undefined;
}, {
    message: string;
    type: string;
    read?: boolean | undefined;
}>;
//# sourceMappingURL=notification.schema.d.ts.map