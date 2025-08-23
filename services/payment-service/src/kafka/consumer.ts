import { Kafka, Consumer, EachMessagePayload } from "kafkajs";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import { PaymentService } from "../services/payment.service";

class PaymentEventConsumer {
  private kafka: Kafka;
  private consumer: Consumer;
  private connected = false;

  constructor() {
    this.kafka = new Kafka({
      clientId: "payment-service-consumer",
      brokers: env.kafkaBrokers,
    });
    this.consumer = this.kafka.consumer({ groupId: env.kafkaConsumerGroupId });
  }

  async connect() {
    if (this.connected) return;
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: "payment_events", fromBeginning: false });
    this.connected = true;
    logger.info("Kafka consumer connected");
  }

  async disconnect() {
    if (!this.connected) return;
    await this.consumer.disconnect();
    this.connected = false;
    logger.info("Kafka consumer disconnected");
  }

  async run() {
    await this.connect();
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
        try {
          if (!message.value) {
            logger.warn("Received empty Kafka message");
            return;
          }
          const event = JSON.parse(message.value.toString());
          logger.info("Received payment event", { eventType: event.eventType, paymentId: event.paymentId });

          switch (event.eventType) {
            case "payment.completed":
              // Implement business logic if any needed via PaymentService or other service
              logger.info("Processing payment.completed event", { paymentId: event.paymentId });
              break;

            case "payment.failed":
              logger.info("Processing payment.failed event", { paymentId: event.paymentId });
              break;

            case "payment.refund.initiated":
              logger.info("Processing payment.refund.initiated event", { paymentId: event.paymentId });
              break;

            // Add other event types here as needed

            default:
              logger.warn("Unknown payment event type received", { eventType: event.eventType });
          }
        } catch (err) {
          logger.error("Error processing payment event message", { error: err });
        }
      },
    });
  }
}

export const paymentEventConsumer = new PaymentEventConsumer();
