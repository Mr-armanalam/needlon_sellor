import { z } from "zod";

export const publishProductSchema = z.object({
    publishedAt: z.date().optional(),
});