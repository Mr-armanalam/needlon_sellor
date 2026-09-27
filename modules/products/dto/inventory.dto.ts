import { z } from "zod";

export const updateInventoryStockSchema = z.object({
  variantId: z.string().uuid("Invalid variant ID"),
  quantity: z.number().int().min(0, "Quantity must be non-negative"),
  reservedQuantity: z.number().int().min(0).optional(),
  lowStockThreshold: z.number().int().min(0).optional(),
  allowBackorder: z.boolean().optional(),
});

export const adjustStockSchema = z.object({
  variantId: z.string().uuid("Invalid variant ID"),
  adjustment: z.number().int(), // Positive to add, negative to subtract
  reason: z.string().min(1, "Reason is required").optional(),
});

export const getInventoryQuerySchema = z.object({
  lowStockOnly: z.enum(["true", "false"]).optional(),
  search: z.string().optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
});

export type UpdateInventoryStockDto = z.infer<typeof updateInventoryStockSchema>;
export type AdjustStockDto = z.infer<typeof adjustStockSchema>;
export type GetInventoryQueryDto = z.infer<typeof getInventoryQuerySchema>;

export interface InventoryItemResponseDto {
  id: string;
  variantId: string;
  variantName: string | null;
  sku: string | null;
  productName: string | null;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockThreshold: number;
  allowBackorder: boolean;
  isLowStock: boolean;
  lastAdjustedAt: string | null;
}
