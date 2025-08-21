"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.producer = void 0;
exports.emitPaymentEvent = emitPaymentEvent;
const kafkajs_1 = require("kafkajs");
const kafka = new kafkajs_1.Kafka({ brokers: [process.env.KAFKA_BROKER || "localhost:9092"] });
exports.producer = kafka.producer();
async function emitPaymentEvent(event) {
    await exports.producer.connect();
    await exports.producer.send({
        topic: "payment_events",
        messages: [{ value: JSON.stringify(event) }],
    });
}
//# sourceMappingURL=producer.js.map