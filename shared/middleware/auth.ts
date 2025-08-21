import { Request, Response, NextFunction } from "express";
import { getSessionUser } from "../auth";
import { UserRole } from "../types";

//const JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret_for_unit_tests";

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = getSessionUser(req);
    if (!user?.roles) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const hasRole = user.roles.some(role => allowedRoles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = getSessionUser(req);
  if (
    !user ||
    !user.roles.some(role => role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN)
  ) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}
