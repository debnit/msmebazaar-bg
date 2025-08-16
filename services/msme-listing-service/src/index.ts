import express from "express";
import { Config } from "./config/env";
import listingRoutes from "./routes/listing.routes";
import { logger } from "./utils/logger";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/listing", listingRoutes);

app.listen(Config.port, () => {
  logger.info(`MSME Listing service running on port ${Config.port}`);
});
