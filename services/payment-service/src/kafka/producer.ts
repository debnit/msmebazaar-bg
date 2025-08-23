// services/payment-service/src/kafka/producer.ts

import { Kafka, Producer, ProducerBatch, ProducerRecord } from "kafkajs";
import { logger } from "../utils/logger";
import { env } from "../config/env";

export interface PaymentEvent {
  eventType: string;
  paymentId: string;
  userId: string;
  timestamp: string;
  data: Record<string, any>;
}

class PaymentEventProducer {
  private kafka: Kafka;
  private producer: Producer;
  private connected: boolean = false;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'payment-service-producer',
      brokers: env.kafkaBrokers || ['localhost:9092'],
      retry: {
        initialRetryTime: 100,
        retries: 8
      },
      connectionTimeout: 3000,
      requestTimeout: 30000,
    });

    this.producer = this.kafka.producer({
      maxInFlightRequests: 1,
      idempotent: true,
      transactionTimeout: 30000,
    });
  }

  async connect(): Promise<void> {
    if (this.connected) return;

    try {
      await this.producer.connect();
      this.connected = true;
      logger.info('Kafka producer connected successfully');
    } catch (error: any) {
      logger.error('Failed to connect Kafka producer', {
        error: error.message,
      });
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.connected) return;

    try {
      await this.producer.disconnect();
      this.connected = false;
      logger.info('Kafka producer disconnected');
    } catch (error: any) {
      logger.error('Failed to disconnect Kafka producer', {
        error: error.message,
      });
    }
  }

  async publishPaymentEvent(event: PaymentEvent): Promise<void> {
    if (!this.connected) {
      await this.connect();
    }

    try {
      const message: ProducerRecord = {
        topic: 'payment_events',
        messages: [
          {
            key: event.paymentId,
            value: JSON.stringify({
              ...event,
              timestamp: new Date().toISOString(),
              version: '1.0',
            }),
            headers: {
              eventType: event.eventType,
              source: 'payment-service',
              userId: event.userId,
            },
          },
        ],
      };

      await this.producer.send(message);
      
      logger.info('Payment event published successfully', {
        eventType: event.eventType,
        paymentId: event.paymentId,
        userId: event.userId,
      });
    } catch (error: any) {
      logger.error('Failed to publish payment event', {
        error: error.message,
        eventType: event.eventType,
        paymentId: event.paymentId,
      });
      throw error;
    }
  }

  async publishBatch(events: PaymentEvent[]): Promise<void> {
    if (!this.connected) {
      await this.connect();
    }

    try {
      const batch: ProducerBatch = {
        topicMessages: [
          {
            topic: 'payment_events',
            messages: events.map(event => ({
              key: event.paymentId,
              value: JSON.stringify({
                ...event,
                timestamp: new Date().toISOString(),
                version: '1.0',
              }),
              headers: {
                eventType: event.eventType,
                source: 'payment-service',
                userId: event.userId,
              },
            })),
          },
        ],
      };

      await this.producer.sendBatch(batch);
      
      logger.info('Payment event batch published successfully', {
        eventCount: events.length,
      });
    } catch (error: any) {
      logger.error('Failed to publish payment event batch', {
        error: error.message,
        eventCount: events.length,
      });
      throw error;
    }
  }
}

export const paymentEventProducer = new PaymentEventProducer();

// Helper functions for common events
export const publishEvents = {
  orderCreated: (paymentId: string, userId: string, data: any) =>
    paymentEventProducer.publishPaymentEvent({
      eventType: 'payment.order.created',
      paymentId,
      userId,
      timestamp: new Date().toISOString(),
      data,
    }),

  paymentCompleted: (paymentId: string, userId: string, data: any) =>
    paymentEventProducer.publishPaymentEvent({
      eventType: 'payment.completed',
      paymentId,
      userId,
      timestamp: new Date().toISOString(),
      data,
    }),

  paymentFailed: (paymentId: string, userId: string, data: any) =>
    paymentEventProducer.publishPaymentEvent({
      eventType: 'payment.failed',
      paymentId,
      userId,
      timestamp: new Date().toISOString(),
      data,
    }),

  refundInitiated: (paymentId: string, userId: string, data: any) =>
    paymentEventProducer.publishPaymentEvent({
      eventType: 'payment.refund.initiated',
      paymentId,
      userId,
      timestamp: new Date().toISOString(),
      data,
    }),

  // Newly added event for updating payment status
  paymentStatusUpdated: (paymentId: string, userId: string, data: any) =>
    paymentEventProducer.publishPaymentEvent({
      eventType: 'payment.status.updated',
      paymentId,
      userId,
      timestamp: new Date().toISOString(),
      data,
    }),
};
