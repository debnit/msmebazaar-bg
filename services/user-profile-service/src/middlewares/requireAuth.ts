import { Request, Response, NextFunction } from "express";
import { getSession } from "../../../shared/session"; // Path to shared session utility

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const session = await getSession(req);
  if (!session?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.user = { id: session.userId };
  next();
}
