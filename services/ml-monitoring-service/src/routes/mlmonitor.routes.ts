import { Router } from "express";
import requireAuth from "../middlewares/requireAuth";
import * as controller from "../controllers/mlmonitor.controller";

const router = Router();
router.use(requireAuth);

// List all jobs, filterable by status (?status=completed)
router.get("/", controller.listJobs);
// Get a single job
router.get("/:id", controller.getJob);

export default router;
