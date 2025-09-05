import { Request, Response, NextFunction } from "express";
//import { getSessionUser } from "@msmebazaar/shared/middleware/auth"; // Path to shared session utility
import { getSessionUser } from "@msmebazaar/shared/auth";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const session = await getSessionUser(req);
  if (!session?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.user = { id: session.userId };
  next();
}
