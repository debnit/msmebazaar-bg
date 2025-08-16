import request from "supertest";
import express from "express";
import loanRoutes from "../routes/loan.routes";
import { prisma } from "../db/prismaClient";

const app = express();
app.use(express.json());
app.use("/loan", loanRoutes);

describe("Loan Service", () => {
  // Add before/afterAll as needed to create test user and clean up
  it("should reject unauthenticated requests", async () => {
    const res = await request(app).post("/loan/cta").send({
      loanAmount: 100000,
      purpose: "equipment upgrade",
      tenureMonths: 24
    });
    expect(res.statusCode).toBe(401); // no token provided
  });
  // Other tests assume JWT is properly passed
});
