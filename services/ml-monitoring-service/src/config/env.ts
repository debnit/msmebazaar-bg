import dotenv from "dotenv";
dotenv.config();

export const Config = {
  port: process.env.SERVICE_PORT || 8025,
  dbUrl: process.env.DATABASE_URL!,
  kafkaBrokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
  kafkaGroupId: process.env.KAFKA_GROUP_ID || "ml-monitoring-service-group",
  kafkaTopic: process.env.KAFKA_TOPIC || "ml-jobs",
  jwtSecret: process.env.JWT_SECRET || "changeme",

};
