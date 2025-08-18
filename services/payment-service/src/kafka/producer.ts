import { Kafka } from "kafkajs";

const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER || "localhost:9092"] });
export const producer = kafka.producer();

export async function emitPaymentEvent(event: object) {
  await producer.connect();
  await producer.send({
    topic: "payment_events",
    messages: [{ value: JSON.stringify(event) }],
  });
}
