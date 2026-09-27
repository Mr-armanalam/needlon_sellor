import { z } from "zod";

export const getCustomersQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
});

export type GetCustomersQueryDto = z.infer<typeof getCustomersQuerySchema>;

export interface CustomerItemResponseDto {
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string | null;
  totalOrders: number;
  totalSpent: string;
  lastOrderAt: string;
}
