import { Router } from "express";
import requireAuth from "../middlewares/requireAuth";
import { validateRequest } from "../middlewares/validateRequest";
import * as controller from "../controllers/msme.controller";
import { msmeCreateSchema, msmeUpdateSchema } from "../../../../shared/validation/msme.schema";

const router = Router();
router.use(requireAuth);

// Create MSME
router.post("/", validateRequest(msmeCreateSchema), controller.createMsme);

// Get MSME by id
router.get("/:id", controller.getMsme);

// Get all MSMEs for owner (supports /owner/me)
router.get("/owner/:ownerId", controller.getMsmesByOwner);

// Update MSME by id
router.put("/:id", validateRequest(msmeUpdateSchema), controller.updateMsme);

// Delete MSME by id
router.delete("/:id", controller.deleteMsme);

export default router;
