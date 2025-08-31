import { Request, Response, NextFunction } from "express";
import { getSessionUser } from "@msmebazaar/shared/auth/index";

const PUBLIC_PATHS = ["/auth/register", "/auth/login","/auth/logout","auth/refresh"];

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const path = req.originalUrl.split("?")[0]; // normalize URL without query params

  // Allow requests to public routes
  if (PUBLIC_PATHS.some(publicPath => path.startsWith(publicPath))) {
    return next();
  }

  const user = getSessionUser(req);
  if (!user || !user.id) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }
    
  next();
}
