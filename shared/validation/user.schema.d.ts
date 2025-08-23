import { z } from "zod";
export declare const updateProfileSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    avatarUrl: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    socialLinks: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    phone?: string | undefined;
    avatarUrl?: string | undefined;
    bio?: string | undefined;
    address?: string | undefined;
    socialLinks?: Record<string, string> | undefined;
}, {
    name?: string | undefined;
    phone?: string | undefined;
    avatarUrl?: string | undefined;
    bio?: string | undefined;
    address?: string | undefined;
    socialLinks?: Record<string, string> | undefined;
}>;
export declare const updatePreferencesSchema: z.ZodObject<{
    theme: z.ZodOptional<z.ZodEnum<["light", "dark"]>>;
    notifications: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    theme?: "light" | "dark" | undefined;
    notifications?: boolean | undefined;
}, {
    theme?: "light" | "dark" | undefined;
    notifications?: boolean | undefined;
}>;
export declare const userIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;
export type UserIdParamInput = z.infer<typeof userIdParamSchema>;
