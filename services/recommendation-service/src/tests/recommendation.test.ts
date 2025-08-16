import request from "supertest";
import express from "express";
import recommendationRoutes from "../routes/recommendation.routes";

const app = express();
app.use(express.json());
app.use("/recommendation", recommendationRoutes);

describe("Recommendation Service", () => {
  it("should require authentication for recommendations", async () => {
    const res = await request(app)
      .post("/recommendation/recommend")
      .send({ limit: 3 });
    expect(res.statusCode).toBe(401); // No token provided
  });

  // Add test with JWT as needed
});
