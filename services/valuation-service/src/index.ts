import express from "express";
import { Config } from "./config/env";
import { logger } from "./utils/logger";
import cors from "cors";
import { startConsumer } from "./kafka/consumer";
import valuationRoutes from "./routes/valuation.routes";

const app = express();
app.use(express.json());
app.use(cors());

app.use('/business-valuation', valuationRoutes);

app.listen(Config.port, () => {
  logger.info("valuation-service running on port " + Config.port);
  startConsumer().catch(err => logger.error("Kafka consumer failed:", err));
});
