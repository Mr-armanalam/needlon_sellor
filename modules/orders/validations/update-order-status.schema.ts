import { z } from "zod";

export const updateOrderStatusBodySchema = z.object({
    action: z.enum(["ADVANCE", "CANCEL"]),
    remarks: z.string().min(1, "Remarks are required"),
});
