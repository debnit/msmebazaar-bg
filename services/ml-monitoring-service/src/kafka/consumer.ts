import { Kafka } from "kafkajs";
import { Config } from "../config/env";
import * as mlMonitorService from "../services/mlmonitor.service";
import { logger } from "../utils/logger";

const kafka = new Kafka({
  clientId: "ml-monitoring-service",
  brokers: Config.kafkaBrokers,
});
const consumer = kafka.consumer({ groupId: Config.kafkaGroupId });

export async function startMLJobConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: Config.kafkaTopic });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        // Example message: { id, service, status, metrics, startedAt, endedAt }
        const payload = JSON.parse(message.value?.toString() || "{}");
        if (payload.id && payload.status) {
          await mlMonitorService.upsertJobViaEvent(payload);
          logger.info({ msg: "ML job event processed", payload });
        }
      } catch (error) {
        logger.error({ msg: "Error processing ML job message", error });
      }
    },
  });
}
