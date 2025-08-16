import dotenv from "dotenv";
dotenv.config();

export const Config = {
  port: process.env.SERVICE_PORT || 8005,
  dbUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET || "changeme"
};
