import { SignOptions } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types/feature";
import { SessionUser } from "../types/user";
export interface BaseJwtClaims {
    id: string;
    email: string;
    name: string;
    isPro?: boolean;
    onboardedProAt?: string;
    roles: UserRole[];
    createdAt: string;
    updatedAt: string;
}
export declare function createJwtToken(payload: BaseJwtClaims, secret: string, expiresIn?: string | number, options?: Partial<SignOptions>): string;
export declare function verifyJwtToken<T extends BaseJwtClaims = BaseJwtClaims>(token: string, secret: string): T | null;
export declare function hashPassword(password: string, saltRounds?: number): Promise<string>;
export declare function verifyPassword(password: string, hash: string): Promise<boolean>;
export declare function getSessionUser(req: Request): SessionUser | null;
export declare function jwtMw(secret: string, rejectOnInvalid?: boolean): (req: Request & {
    user?: SessionUser;
}, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=index.d.ts.map