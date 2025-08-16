import { z } from "zod";

export const notificationSchema = z.object({
  type: z.string().min(3),
  message: z.string().min(3),
  read: z.boolean().optional()
});
