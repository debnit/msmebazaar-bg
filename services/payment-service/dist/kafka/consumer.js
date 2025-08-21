"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startConsumer = startConsumer;
const kafkajs_1 = require("kafkajs");
const payment_service_1 = require("../services/payment.service");
const kafka = new kafkajs_1.Kafka({
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});
const consumer = kafka.consumer({ groupId: 'payment-service-group' });
async function startConsumer() {
    await consumer.connect();
    await consumer.subscribe({ topic: 'payment_events', fromBeginning: false });
    await consumer.run({
        eachMessage: async ({ message }) => {
            if (message.value) {
                const event = JSON.parse(message.value.toString());
                // Handle payment event, e.g., update DB status
                await (0, payment_service_1.updatePaymentStatus)(event.paymentId, event.status, event.gatewayRef);
            }
        }
    });
}
//# sourceMappingURL=consumer.js.map