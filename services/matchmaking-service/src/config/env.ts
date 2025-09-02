import dotenv from "dotenv";
dotenv.config();

export const Config = {
  
  port: process.env.SERVICE_PORT || 8007,
  dbUrl: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/msmebazaar",
  kafkaBrokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
  kafkaGroupId: process.env.KAFKA_GROUP_ID || "matchmaking-service-group",
  kafkaTopic: process.env.KAFKA_TOPIC || "default-topic",
  jwtSecret: process.env.JWT_SECRET || "your-super-secret-jwt-key",

};
