#!/bin/bash
set -e

KAFKA_VERSION="3.7.0"
SCALA_VERSION="2.13"
KAFKA_DIR="./kafka"
KAFKA_TGZ="kafka_${SCALA_VERSION}-${KAFKA_VERSION}.tgz"
KAFKA_URL="https://archive.apache.org/dist/kafka/${KAFKA_VERSION}/${KAFKA_TGZ}"


echo "=== Checking Kafka installation ==="
if [ ! -d "$KAFKA_DIR" ]; then
  echo "Downloading Kafka $KAFKA_VERSION..."
  curl -s -O $KAFKA_URL
  echo "Extracting Kafka..."
  tar -xzf $KAFKA_TGZ
  mv kafka_${SCALA_VERSION}-${KAFKA_VERSION} $KAFKA_DIR
  rm $KAFKA_TGZ
else
  echo "Kafka already exists in $KAFKA_DIR"
fi

echo "=== Starting Zookeeper ==="
$KAFKA_DIR/bin/zookeeper-server-start.sh -daemon $KAFKA_DIR/config/zookeeper.properties
sleep 5

echo "=== Starting Kafka Broker ==="
$KAFKA_DIR/bin/kafka-server-start.sh -daemon $KAFKA_DIR/config/server.properties
sleep 5

echo "=== Ensuring topic 'payment_events' exists ==="
$KAFKA_DIR/bin/kafka-topics.sh --create --if-not-exists \
  --topic payment_events \
  --bootstrap-server localhost:9092 \
  --partitions 1 \
  --replication-factor 1

echo "=== Kafka is up and running ==="
echo "  - Zookeeper: localhost:2181"
echo "  - Kafka Broker: localhost:9092"
echo "  - Topic: payment_events"
