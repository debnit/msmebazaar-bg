import express from "express";
import { Config } from "./config/env";
import { logger } from "./utils/logger";
import cors from "cors";
import userProfileRoutes from "./routes/userProfile.routes";
import kycRoutes from "./routes/kyc.routes";


// import your routes here, e.g.:
// import apiRoutes from "./routes/api.routes";

const app = express();
app.use(express.json());
app.use(cors());

// app.use("/api", apiRoutes);

app.listen(Config.port, () => {
  logger.info("user-profile-service running on port " + Config.port);
});

app.use("/user", userProfileRoutes);
app.use("/user", kycRoutes);

export default app;
