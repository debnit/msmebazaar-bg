import type { Request, Response } from "express";
import * as service from "../services/mlmonitor.service";

export const listJobs = async (req: Request, res: Response) => {
  const { status } = req.query;
  const jobs = await service.listJobs(status as string | undefined);
  res.json({ success: true, data: jobs });
};

export const getJob = async (req: Request, res: Response) => {
  const job = await service.getJob(req.params.id);
  if (!job) return res.status(404).json({ success: false, message: "Job not found" });
  res.json({ success: true, data: job });
};
