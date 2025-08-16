import * as repo from "../repositories/mljob.repository";
import { MLJob } from "@prisma/client";

// Called from Kafka consumer on each ML job event/update
export async function upsertJobViaEvent(event: any): Promise<MLJob> {
  const { id, service, status, metrics, startedAt, endedAt } = event;
  const job = await repo.getMLJobById(id);
  if (!job) {
    // New job record
    return repo.createMLJob({
      service,
      status,
      metrics,
      startedAt: startedAt ? new Date(startedAt) : undefined,
      endedAt: endedAt ? new Date(endedAt) : undefined
    });
  } else {
    // Update status/metrics
    return repo.updateMLJob(id, {
      status,
      metrics,
      endedAt: endedAt ? new Date(endedAt) : undefined
    });
  }
}

export async function listJobs(status?: string): Promise<MLJob[]> {
  return repo.listMLJobs(status ? { status } : {});
}

export async function getJob(id: string): Promise<MLJob | null> {
  return repo.getMLJobById(id);
}
