import express from "express";
import paymentRoutes from "./routes/payment.routes";

const app = express();
app.use(express.json());

app.use("/payments", paymentRoutes);

app.get("/health", (_, res) => res.send("OK"));

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
});

export default app;
