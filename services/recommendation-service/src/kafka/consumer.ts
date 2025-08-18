import { Kafka } from "kafkajs";
import { Config } from "../config/env";
import { logger } from "../utils/logger";

const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] });


export const consumer = kafka.consumer({ groupId: 'reco-events' });


export async function startRecoConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'reco.events.raw', fromBeginning: false });
  await consumer.run({
    eachMessage: async ({ message }) => {
      // handle event, e.g., update embeddings
      const evt = JSON.parse(message.value?.toString() || '{}');
      // optionally forward to ML model monitoring, update user profile state, etc.
    }
  });
}

