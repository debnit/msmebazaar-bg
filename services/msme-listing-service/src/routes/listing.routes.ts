import { Router } from "express";
import requireAuth from "../middlewares/requireAuth";
import * as controller from "../controllers/listing.controller";
import { validateRequest } from "../middlewares/validateRequest";
import { listingSchema } from "@shared/validation/listing.schema";

const router = Router();
router.use(requireAuth);

router.post(
  "/create",
  validateRequest(listingSchema),
  controller.createListing
);

router.get("/:msmeId", controller.listMsme);

export default router;
