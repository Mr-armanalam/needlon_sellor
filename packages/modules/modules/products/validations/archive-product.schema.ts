import { z } from "zod";

export const archiveProductSchema = z.object({
    reason: z
        .string()
        .trim()
        .max(500)
        .optional(),
});