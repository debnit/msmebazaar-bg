import { Router } from "express";
import  requireAuth  from "../middlewares/requireAuth";
import {  requireRole } from "@msmebazaar/shared/middleware/auth";
import { createMatchController, getMatchesController } from "../controllers/matchmaking.controller";


const router = Router();

router.post("/matchmaking", requireAuth, createMatchController);
router.get("/matchmaking", requireAuth, getMatchesController);

// Expose special matchmaking for pro/early buyers:
router.get("/premium",requireAuth,requireRole, getMatchesController);

export default router;
