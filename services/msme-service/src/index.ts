import express from "express";
import { Config } from "./config/env";
import msmeRoutes from "./routes/msme.routes";
import { logger } from "./utils/logger";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// API Route
app.use("/msme", msmeRoutes);

app.listen(Config.port, () => {
  logger.info(`msme-service running on port ${Config.port}`);
});
