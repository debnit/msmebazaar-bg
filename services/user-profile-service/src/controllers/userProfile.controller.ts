import { Request, Response } from "express";
import * as z from "zod";   
import { Request, Response } from "express";
import { getAdvancedProfileAnalytics } from "../services/userProfile.service";
import { getSessionUser } from "../../../shared/auth";
import { updateUserProfileSchema } from "../schemas/user.schema";

export async function getProfileController(req: Request, res: Response) {
  const userId = req.user.id;
  const profile = await getUserProfile(userId);
  if (!profile) return res.status(404).json({ error: "Profile not found" });
  res.json(profile);
}

export async function updateProfileController(req: Request, res: Response) {
  const userId = req.user.id;
  const parse = updateUserProfileSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid data", details: parse.error.flatten() });
  }
  const profile = await updateUserProfile(userId, parse.data);
  res.json(profile);
}

export async function getProProfileAnalyticsController(req: Request, res: Response) {
  try {
    const user = getSessionUser(req);
    if (!user || !user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    // Call service method to get analytics data for the user
    const analyticsData = await getAdvancedProfileAnalytics(user.id);
    res.json({ success: true, data: analyticsData });
  } catch (error) {
    console.error("Error getting pro profile analytics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
