import { z } from "zod";
export declare const superAdminCreateSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodLiteral<"super_admin">;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    role: "super_admin";
}, {
    email: string;
    password: string;
    role: "super_admin";
}>;
