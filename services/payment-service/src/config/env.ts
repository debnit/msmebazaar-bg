import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: process.env.SERVICE_PORT || 8000,
  jwtSecret: process.env.JWT_SECRET || "changeme",
  dbUrl: process.env.DATABASE_URL!,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "your_test_key_id",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "your_test_key_secret",
};
