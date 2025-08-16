import express from "express";
import routes from "./routes/serviceRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use("/api", routes);
app.use(errorHandler);

app.listen(process.env.GATEWAY_PORT || 3000, () => {
  console.log(`API Gateway running on port ${process.env.GATEWAY_PORT || 3000}`);
});
