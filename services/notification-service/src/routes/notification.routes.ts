import { Router } from "express";
import requireAuth from "../middlewares/requireAuth";
import * as controller from "../controllers/notification.controller";
// No POST/create: write operations are Kafka-ingested only

const router = Router();
router.use(requireAuth);

router.get("/", controller.listNotifications);
router.post("/:id/read", controller.markAsRead);

export default router;
