import express from "express";
import { Config } from "./config/env";
import { logger } from "./utils/logger";
import cors from "cors";
import exitRoutes from "./routes/exit.routes";

const app = express();
app.use(express.json());
app.use(cors());

app.use('/exit-strategy', exitRoutes);

app.listen(Config.port, () => {
  logger.info("exit-as-a-service running on port " + Config.port);
});
