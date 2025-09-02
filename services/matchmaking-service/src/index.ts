import express from "express";
import matchmakingRoutes from "./routes/matchmaking.routes";
import { startConsumer } from "./kafka/consumer";
import { startProducer } from "./kafka/producer";
import { logger } from "./utils/logger";
import { Config } from "./config/env";

const app = express();
app.use(express.json());

app.use("/matchmaking", matchmakingRoutes);

const server = app.listen(Config.port, () => {
  logger.info(`Auth service running on port ${Config.port}`, {
    
    nodeVersion: process.version
  });
});


startProducer();
startConsumer();

export default app;
