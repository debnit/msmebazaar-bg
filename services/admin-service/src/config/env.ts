import dotenv from "dotenv";
dotenv.config();

export const Config = {
  port: process.env.SERVICE_PORT || 8009,
  jwtSecret: process.env.JWT_SECRET || "your-super-secret-jwt-key",
  dbUrl: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/msmebazaar"
};


