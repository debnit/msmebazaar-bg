import express from "express";
import matchmakingRoutes from "./routes/matchmaking.routes";
import { startConsumer } from "./kafka/consumer";
import { startProducer } from "./kafka/producer";

const app = express();
app.use(express.json());

app.use("/matchmaking", matchmakingRoutes);

startProducer();
startConsumer();

export default app;
