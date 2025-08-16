import type { Request, Response } from "express";
import * as service from "../services/notification.service";

export const listNotifications = async (req: Request & { user?: any }, res: Response) => {
  const notifications = await service.listNotifications(req.user.id);
  res.json({ success: true, data: notifications });
};

export const markAsRead = async (req: Request & { user?: any }, res: Response) => {
  const notification = await service.markAsRead(req.params.id, req.user.id);
  res.json({ success: true, data: notification });
};
