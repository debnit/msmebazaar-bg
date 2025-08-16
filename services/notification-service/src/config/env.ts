export const Config = {
  port: process.env.SERVICE_PORT || 8006,
  jwtSecret: process.env.JWT_SECRET || "changeme",
  dbUrl: process.env.DATABASE_URL!,
  kafkaBrokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
  notificationTopic: process.env.NOTIFICATION_TOPIC || "notifications",
};
