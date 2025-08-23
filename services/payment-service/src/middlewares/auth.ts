// services/payment-service/src/middlewares/auth.ts

import { Request, Response, NextFunction } from "express";
import { getSessionUser, jwtMw } from "@shared/auth"; // Use your configured path alias
import { UserRole } from "@shared/types/feature";
import { UnauthorizedError, ForbiddenError } from "../utils/errors";
import { logger } from "../utils/logger";

/**
 * Middleware to strictly authenticate JWT from Authorization header.
 * Rejects with 401 Unauthorized if token missing or invalid.
 */
export const authenticateJwt = jwtMw(process.env.JWT_SECRET || "", true);
export {UserRole} ;
/**
 * Middleware to require authenticated user on the request.
 * Adds the user object to req.user.
 * Throws UnauthorizedError if not authenticated.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = getSessionUser(req);
  if (!user) {
    logger.warn("Authentication required but no user found", { ip: req.ip, path: req.path });
    return next(new UnauthorizedError("Authentication required"));
  }
  req.user = user;
  next();
}

/**
 * Role-based authorization middleware factory.
 * Pass one or more allowed roles.
 * Checks if user's roles intersect allowed roles, else throws ForbiddenError.
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = getSessionUser(req);
    if (!user || !user.roles) {
      logger.warn("Authorization failed - missing user roles", { ip: req.ip, path: req.path });
      return next(new UnauthorizedError("Authentication required"));
    }
    const hasAccess = user.roles.some((role) => allowedRoles.includes(role));
    if (!hasAccess) {
      logger.warn("Authorization failed - insufficient roles", {
        userId: user.id,
        userRoles: user.roles,
        requiredRoles: allowedRoles,
        path: req.path,
      });
      return next(new ForbiddenError("Insufficient permissions"));
    }
    next();
  };
}

/**
 * Middleware to restrict access to ADMIN and SUPER_ADMIN roles only.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = getSessionUser(req);
  if (
    !user ||
    !user.roles.some((role) => role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN)
  ) {
    logger.warn("Admin access required but not present", { ip: req.ip, path: req.path });
    return next(new ForbiddenError("Admin access required"));
  }
  next();
}
