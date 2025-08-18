import { Kafka } from 'kafkajs';
import { updatePaymentStatus } from '../services/payment.service';

const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'payment-service-group' });

export async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'payment_events', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (message.value) {
        const event = JSON.parse(message.value.toString());
        // Handle payment event, e.g., update DB status
        await updatePaymentStatus(event.paymentId, event.status, event.gatewayRef);
      }
    }
  });
}
