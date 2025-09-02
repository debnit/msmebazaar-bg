import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: $SERVICE_NAME'',
  brokers: ['localhost:9092'],
});

export default kafka;
