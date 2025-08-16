

import express from "express";
import { Config } from "./config/env";
import authRoutes from "./routes/auth.routes";
import { logger } from "./utils/logger";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/auth", authRoutes);

app.listen(Config.port, () => {
  logger.info(`Auth service running on port ${Config.port}`);
});
