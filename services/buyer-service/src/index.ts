import express from "express"
import buyerRoutes from "./routes/buyer.routes"

const app = express()
app.use(express.json())
app.use("/buyer", buyerRoutes)
app.get("/health", (_, res) => res.send("OK"))
export default app
