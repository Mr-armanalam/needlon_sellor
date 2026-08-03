import { z } from "zod";

export const getOrderByIdParamsSchema = z.object({
    orderId: z.string().uuid("Invalid order ID format"),
});
