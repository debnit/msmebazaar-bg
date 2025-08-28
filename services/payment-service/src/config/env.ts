import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

interface RazorpayConfig {
  keyId: string;
  keySecret: string;
  webhookSecret: string; // Add this line

}

interface EnvConfig {
  port: number;
  nodeEnv: "development" | "production" | "test";
  dbUrl: string;
  jwtSecret: string;
  razorpay: RazorpayConfig;
  kafkaBrokers: string[];
  kafkaConsumerGroupId: string;
  logLevel: "info" | "debug" | "warn" | "error";
}

export const env: EnvConfig = {
  port: Number(process.env["SERVICE_PORT"] || 8029),
  nodeEnv: (process.env["NODE_ENV"] as any) || "development",
  dbUrl: process.env["DATABASE_URL"] || ,
  jwtSecret: process.env["JWT_SECRET"] || "",
  razorpay: {
    keyId: process.env["RAZORPAY_KEY_ID"] || "your_key_id",
    keySecret: process.env["RAZORPAY_KEY_SECRET"] || "",
    webhookSecret: process.env["RAZORPAY_WEBHOOK_SECRET"] || "",
  },
  kafkaBrokers: (process.env["KAFKA_BROKERS"] || "localhost:9092")
    .split(",")
    .map((broker) => broker.trim()),
  kafkaConsumerGroupId: process.env["KAFKA_CONSUMER_GROUP_ID"] || "payment-service-group",
  logLevel: (process.env["LOG_LEVEL"] as any) || "info",
};
