import { Request, Response } from "express";
import * as userProfileService from "../services/userProfile.service";
import { getSessionUser } from "@msmebazaar/shared/auth";
import { updateUserProfileSchema } from "../schemas/user.schema";

export async function getProfileController(req: Request, res: Response) {
  try {
    const userId = req.user.id;
    const profile = await userProfileService.getUserProfile(userId);
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (error) {
    console.error("Error getting profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateProfileController(req: Request, res: Response) {
  try {
    const userId = req.user.id;
    const parse = updateUserProfileSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: "Invalid data", details: parse.error.flatten() });
    }
    const profile = await userProfileService.updateUserProfile(userId, parse.data);
    res.json(profile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getProProfileAnalyticsController(req: Request, res: Response) {
  try {
    const user = getSessionUser(req);
    if (!user || !user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const analyticsData = await userProfileService.getAdvancedProfileAnalytics(user.id);
    res.json({ success: true, data: analyticsData });
  } catch (error) {
    console.error("Error getting pro profile analytics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
} 
/*export async function getBasicProfileAnalyticsController(req: Request, res: Response) {
  try {
    const user = getSessionUser(req);
    if (!user || !user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const analyticsData = await userProfileService.getBasicProfileAnalytics(user.id);
    res.json({ success: true, data: analyticsData });
  } catch (error) {
    console.error("Error getting basic profile analytics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}*/    
