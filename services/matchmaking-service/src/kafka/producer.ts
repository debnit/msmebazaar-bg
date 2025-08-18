import { Kafka } from "kafkajs";

const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER || "localhost:9092"] });
const producer = kafka.producer();

export async function startProducer() {
  await producer.connect();
}

export async function produceMatchmakingEvent(event: any) {
  await producer.send({
    topic: "matchmaking_created",
    messages: [{ value: JSON.stringify(event) }],
  });
}
