import { Router } from "express";
import { requireAuth, requireProUser } from "../../../shared/middleware/auth";
import { getProfileController, updateProfileController, getProProfileAnalytics } from "../controllers/userProfile.controller";

const router = Router();

router.get("/profile", requireAuth, getProfileController); // Any logged-in user
router.put("/profile", requireAuth, updateProfileController);
router.get("/profile/advanced-analytics", requireAuth, requireProUser, getProProfileAnalytics); // Pro only

export default router;
