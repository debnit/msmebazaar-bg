import { z } from "zod";

export const sellerSchema = z.object({
  userId: z.string().uuid(),
  productCatalog: z.array(z.string()).optional()
});
