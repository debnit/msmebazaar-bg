import { Kafka } from 'kafkajs';
const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] });
export const producer = kafka.producer();
export async function emitRecoEvent(topic: string, payload: any) {
  await producer.send({ topic, messages: [{ value: JSON.stringify(payload) }] });
}
