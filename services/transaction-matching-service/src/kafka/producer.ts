import kafka from './client';

const producer = kafka.producer();

export async function connectProducer() {
  await producer.connect();
}

export async function sendMessage(topic: string, messages: { key?: string; value: string }[]) {
  await producer.send({ topic, messages });
}

export async function disconnectProducer() {
  await producer.disconnect();
}

export default producer;
