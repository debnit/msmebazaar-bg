import { z } from "zod";

export const listingSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(5, "Description required")
});
