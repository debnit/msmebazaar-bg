import dotenv from "dotenv";
dotenv.config();

export const Config = {
  port: process.env.SERVICE_PORT || 8018,
  dbUrl: process.env.DATABASE_URl || "postgresql://postgres:postgres@localhost:5432/msmebazaar",
  kafkaBrokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
  kafkaGroupId: process.env.KAFKA_GROUP_ID || "recommendation-service-group",
  kafkaTopic: process.env.KAFKA_TOPIC || "default-topic"
};
