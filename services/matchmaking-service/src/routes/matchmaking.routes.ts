import { Router } from "express";
import  requireAuth  from "../middlewares/requireAuth";
import {  requireRole } from "@msmebazaar/shared/middleware/auth";
import { createMatchController, getMatchesController } from "../controllers/matchmaking.controller";

const router = Router();

router.post("/matchmaking", jwtMw, createMatchController);
router.get("/matchmaking", jwtMw, getMatchesController);

// Expose special matchmaking for pro/early buyers:

router.get("/premium", jwtMw, requireRole, getMatchesController);

export default router;
