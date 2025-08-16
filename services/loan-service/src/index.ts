import express from "express";
import { Config } from "./config/env";
import loanRoutes from "./routes/loan.routes";
import { logger } from "./utils/logger";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/loan", loanRoutes);

app.listen(Config.port, () => {
  logger.info(`Loan service running on port ${Config.port}`);
});
