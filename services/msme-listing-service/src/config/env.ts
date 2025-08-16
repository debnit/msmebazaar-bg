import dotenv from "dotenv";
dotenv.config();

export const Config = {
  port: process.env.SERVICE_PORT || 8015,
  jwtSecret: process.env.JWT_SECRET || "changeme",
  dbUrl: process.env.DATABASE_URL!,
};
