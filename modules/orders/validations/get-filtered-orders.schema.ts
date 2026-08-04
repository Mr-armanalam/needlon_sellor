import { z } from "zod";

export const getFilteredOrdersQuerySchema = z.object({
    status: z.string().optional(),
    search: z.string().optional(),
    deliveryMode: z.string().optional(),
    valueTier: z.string().optional(),
    dateRange: z.string().optional(),
});
