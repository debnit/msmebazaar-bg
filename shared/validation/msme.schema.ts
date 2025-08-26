import { z } from "zod";

export const msmeSchema = z.object({
  ownerId: z.string().uuid(),
  gstNumber: z.string().min(15).max(15),
  businessName: z.string().min(3),
  address: z.string().optional()
});

// Create should not require ownerId; it will be injected from session in the controller
export const msmeCreateSchema = msmeSchema.omit({ ownerId: true });

export const msmeUpdateSchema = msmeSchema.partial();
