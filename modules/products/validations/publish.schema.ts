import { z } from "zod";

export const publishProductSchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED"]).optional().default("PUBLISHED"),
});

export type PublishProductSchema = z.infer<typeof publishProductSchema>;
