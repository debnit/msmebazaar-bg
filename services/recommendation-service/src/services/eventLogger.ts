// services/recommendation-service/src/services/eventLogger.ts

import prisma from "../db/prismaClient";
import { producer } from "../kafka/producer";

export async function logUserEvent(event: any) {
  try {
    // Save event to DB for offline analysis
    await prisma.userEvent.create({
      data: {
        userId: event.userId,
        eventType: event.eventType,
        listingId: event.listingId,
        queryText: event.queryText,
        filters: event.filters,
        ts: new Date(event.ts),
        sessionId: event.sessionId,
        device: event.device,
      },
    });

    // Publish raw event to Kafka for real-time streaming & ML retraining
    await producer.send({
      topic: "reco.events.raw",
      messages: [{ value: JSON.stringify(event) }],
    });
  } catch (err) {
    console.error("Error logging user event:", err);
    throw err;
  }
}
