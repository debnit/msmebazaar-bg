import { Kafka } from "kafkajs";
import { Config } from "../config/env";
import { logger } from "../utils/logger";

const kafka = new Kafka({
  clientId: "search-matchmaking-service",
  brokers: Config.kafkaBrokers,
});

const consumer = kafka.consumer({ groupId: Config.kafkaGroupId });

export async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: Config.kafkaTopic });
  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const payload = JSON.parse(message.value?.toString() || "{}");
        // TODO: Implement message processing logic
        logger.info({ msg: "Message consumed", payload });
      } catch (error) {
        logger.error({ msg: "Failed to process message", error });
      }
    },
  });
}
