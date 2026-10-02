import { z } from "zod";

export const updateInventorySchema = z.object({
  boutiqueStockCount: z.union([z.string(), z.number()]).transform((val) => Number(val)).optional(),
  uniqueSku: z.string().trim().max(100).optional(),
});

export type UpdateInventorySchema = z.infer<typeof updateInventorySchema>;
