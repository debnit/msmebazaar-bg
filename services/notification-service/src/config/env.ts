export const Config = {
  port: process.env.SERVICE_PORT || 8008,
  jwtSecret: process.env.JWT_SECRET || "your-super-secret-jwt-key",
  dbUrl: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/msmebazaar",
  kafkaBrokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
  notificationTopic: process.env.NOTIFICATION_TOPIC || "notifications",
};
