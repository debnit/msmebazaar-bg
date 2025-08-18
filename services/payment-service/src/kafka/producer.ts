import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const producer = kafka.producer();

export async function startProducer() {
  await producer.connect();
}

export async function emitPaymentEvent(topic: string, message: any) {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }]
  });
}
