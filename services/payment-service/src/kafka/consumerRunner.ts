import { paymentEventConsumer } from "./consumer";
import { logger } from "../utils/logger";

export async function startConsumer() {
  try {
    await paymentEventConsumer.run();
    logger.info("PaymentEventConsumer started");
  } catch (error: any) {
    logger.error("Failed to start PaymentEventConsumer", { error: error.message });
    throw error;
  }
}

export async function stopConsumer() {
  try {
    await paymentEventConsumer.disconnect();
    logger.info("PaymentEventConsumer disconnected");
  } catch (error: any) {
    logger.error("Failed to disconnect PaymentEventConsumer", { error: error.message });
  }
}
