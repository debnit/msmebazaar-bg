import { z } from "zod";

export const agentSchema = z.object({
  userId: z.string().uuid(),
  region: z.string()
});
