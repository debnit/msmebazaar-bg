import { Request, Response, NextFunction } from "express";
import { getSessionUser, SessionUser } from "../auth";

// Auth enforcement
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = getSessionUser(req);
  if (!user || !user.id) {
    return res.status(401).json({ error: "Authentication required" });
  }
  req.user = user;
  next();
}

// Pro subscription enforcement (for feature gating)
export function requireProUser(req: Request, res: Response, next: NextFunction) {
  const user = getSessionUser(req);
  if (!user?.isPro) {
    return res.status(403).json({ error: "Pro subscription required" });
  }
  next();
}

// ₹99 Pro onboarding check (optional)
export function requireProOnboarding(req: Request, res: Response, next: NextFunction) {
  const user = getSessionUser(req);
  if (!user?.isPro || !user?.onboardedProAt) {
    return res.status(403).json({ error: "Onboarding to Pro not completed" });
  }
  next();
}

// Require any role from allowed
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user: SessionUser | null = getSessionUser(req);
    if (!user?.roles) return res.status(401).json({ error: "Authentication required" });
    if (!roles.some(role => user.roles.includes(role))) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
}

// Require admin (admin OR superadmin)
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = getSessionUser(req);
  if (!user || !(user.roles.includes("admin") || user.roles.includes("superadmin"))) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}
