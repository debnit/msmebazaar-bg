import { Kafka } from "kafkajs";
import { Config } from "../config/env";
import * as notificationService from "../services/notification.service";

const kafka = new Kafka({
  clientId: "notification-service",
  brokers: Config.kafkaBrokers,
});

const consumer = kafka.consumer({ groupId: "notification-group" });

export async function startNotificationConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: Config.notificationTopic });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const payload = JSON.parse(message.value.toString());
        await notificationService.createNotification(payload.userId, payload);
      } catch (error) {
        console.error("Error processing notification message:", error);
      }
    },
  });
}
