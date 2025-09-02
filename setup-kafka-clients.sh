#!/bin/bash

BASE_DIR="./services"
BROKER_ADDRESS="localhost:9092"

# Kafka client.ts template
read -r -d '' CLIENT_TS << EOM
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: '',
  brokers: ['${BROKER_ADDRESS}'],
});

export default kafka;
EOM

# Kafka producer.ts template
read -r -d '' PRODUCER_TS << EOM
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
EOM

# Kafka consumer.ts template
read -r -d '' CONSUMER_TS << EOM
import kafka from './client';

const consumer = kafka.consumer({ groupId: '' });

export async function connectConsumer() {
  await consumer.connect();
}

export async function subscribeToTopic(topic: string) {
  await consumer.subscribe({ topic, fromBeginning: false });
}

export function runConsumer(onMessage: (message: string) => void) {
  consumer.run({
    eachMessage: async ({ message }) => {
      if (message.value) onMessage(message.value.toString());
    },
  });
}

export async function disconnectConsumer() {
  await consumer.disconnect();
}

export default consumer;
EOM


echo "Starting Kafka client setup across services..."

for service in $BASE_DIR/*-service; do
  if [ -d "$service/src/kafka" ]; then
    CLIENT_PATH="$service/src/kafka/client.ts"
    PRODUCER_PATH="$service/src/kafka/producer.ts"
    CONSUMER_PATH="$service/src/kafka/consumer.ts"

    SERVICE_NAME=$(basename "$service")

    echo "Configuring Kafka files for $SERVICE_NAME..."

    # Write client.ts with clientId
    echo "${CLIENT_TS//clientId: ''/clientId: '$SERVICE_NAME'}" > "$CLIENT_PATH"

    # Write producer.ts as is
    echo "$PRODUCER_TS" > "$PRODUCER_PATH"

    # Write consumer.ts with groupId
    echo "${CONSUMER_TS//groupId: ''/groupId: '${SERVICE_NAME}-group'}" > "$CONSUMER_PATH"

    echo "Created files in $service/src/kafka/"
  else
    echo "Warning: $service/src/kafka not found, skipping..."
  fi
done

echo "Kafka client setup completed."
