import { z } from "zod";

export const updateInventorySchema = z.object({
  boutiqueStockCount: z.union([z.string(), z.number()]).transform((val) => val === "" ? undefined : Number(val)).optional(),
  uniqueSku: z.string().trim().max(100).optional(),
  lowStockThreshold: z.union([z.string(), z.number()]).transform((val) => val === "" ? undefined : Number(val)).optional(),
  allowBackorder: z.boolean().optional(),
  barcode: z.string().trim().max(100).optional(),
});

export type UpdateInventorySchema = z.infer<typeof updateInventorySchema>;
