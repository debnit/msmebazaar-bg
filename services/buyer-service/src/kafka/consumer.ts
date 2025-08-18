import { Kafka } from "kafkajs";
import matchmakingService from "../services/matchmaking.service";

const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER || "localhost:9092"] });
const consumer = kafka.consumer({ groupId: "matchmaking-group" });

export async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "msme_created", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;
      const msmeData = JSON.parse(message.value.toString());
      await matchmakingService.processNewMsme(msmeData);
    },
  });
}
