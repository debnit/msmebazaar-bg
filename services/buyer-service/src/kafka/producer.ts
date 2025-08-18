// producer.ts
import { Kafka } from "kafkajs"
const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER || "localhost:9092"] })
export const producer = kafka.producer()
export async function produceBuyerEvent(event: object) {
  await producer.connect()
  await producer.send({
    topic: "buyer_events",
    messages: [{ value: JSON.stringify(event) }]
  })
}
// consumer.ts: implement if you want buyer-service to react to events
