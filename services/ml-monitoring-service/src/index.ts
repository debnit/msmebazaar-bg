import express from "express";
import { Config } from "./config/env";
import mlRoutes from "./routes/mlmonitor.routes";
import { logger } from "./utils/logger";
import cors from "cors";
import { startMLJobConsumer } from "./kafka/consumer";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/ml-jobs", mlRoutes);

app.listen(Config.port, () => {
  logger.info(`ML Monitoring service running on port ${Config.port}`);
  startMLJobConsumer()
    .then(() => logger.info("Kafka ML-job consumer running"))
    .catch(err => logger.error("Kafka consumer failed", err));
});
