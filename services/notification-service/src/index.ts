import express from "express";
import { Config } from "./config/env";
import notificationRoutes from "./routes/notification.routes";
import { logger } from "./utils/logger";
import cors from "cors";
import { startNotificationConsumer } from "./kafka/consumer";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/notification", notificationRoutes);

app.listen(Config.port, () => {
  logger.info(`Notification service running on port ${Config.port}`);
  startNotificationConsumer()
    .then(() => logger.info("Kafka notification-consumer running"))
    .catch(err => logger.error("Kafka consumer failed", err));
});
