import express from "express";
import { Config } from "./config/env";
import { logger } from "./utils/logger";
import cors from "cors";
import { startConsumer } from "./kafka/consumer";
import recommendationRoutes from "./routes/recommendation.routes";


const app = express();
app.use(express.json());
app.use(cors());

// TODO: Add routes if HTTP API required

app.listen(Config.port, () => {
  logger.info("recommendation-service running on port " + Config.port);
  startConsumer().catch(err => logger.error("Kafka consumer failed:", err));
});

app.use('/recommendations', recommendationRoutes);
startRecoConsumer();


export default app;
