import { Router } from "express";
import { requireAuth, requireProUser } from "../../../shared/middleware/auth";
import { createMatchController, getMatchesController } from "../controllers/matchmaking.controller";

const router = Router();

router.post("/", requireAuth, createMatchController);
router.get("/", requireAuth, getMatchesController);
// Expose special matchmaking for pro/early buyers:
router.get("/premium", requireAuth, requireProUser, getMatchesController);

export default router;
