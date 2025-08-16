// src/services/notification-producer.ts

import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "loan-service",
  brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(",")
});
const producer = kafka.producer();

export async function publishNotification(payload: { userId: string; type: string; message: string }) {
  await producer.connect();
  await producer.send({
    topic: process.env.NOTIFICATION_TOPIC || "notifications",
    messages: [{ value: JSON.stringify(payload) }],
  });
  await producer.disconnect();
}
