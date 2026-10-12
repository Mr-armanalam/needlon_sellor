import { z } from "zod";

export const updateInventorySchema = z.object({
  boutiqueStockCount: z.union([z.string(), z.number()]).transform((val) => val === "" ? undefined : Number(val)).optional(),
  uniqueSku: z.string().trim().max(100).optional(),
  lowStockThreshold: z.union([z.string(), z.number()]).transform((val) => val === "" ? undefined : Number(val)).optional(),
  allowBackorder: z.boolean().optional(),
  barcode: z.string().trim().max(100).optional(),
  reservedQuantity: z.union([z.string(), z.number()]).transform((val) => val === "" ? undefined : Number(val)).optional(),
  lastAdjustedAt: z.string().optional().nullable(),
  position: z.union([z.string(), z.number()]).transform((val) => val === "" ? undefined : Number(val)).optional(),
});

export type UpdateInventorySchema = z.infer<typeof updateInventorySchema>;
