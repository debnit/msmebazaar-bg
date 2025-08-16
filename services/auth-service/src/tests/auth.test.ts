// src/tests/auth.test.ts
import request from "supertest";
import express from "express";
import authRoutes from "../routes/auth.routes";
import { prisma } from "../db/prismaClient";
import { Config } from "../config/env";

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: "testuser@example.com" } });
  await prisma.$disconnect();
});

describe("Auth Service", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/auth/register").send({
      email: "testuser@example.com",
      password: "StrongPass123",
      name: "Test User"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("testuser@example.com");
  });

  it("should login the registered user", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "testuser@example.com",
      password: "StrongPass123"
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
  });

  it("should fail login for wrong password", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "testuser@example.com",
      password: "WrongPass"
    });
    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
  });
});
