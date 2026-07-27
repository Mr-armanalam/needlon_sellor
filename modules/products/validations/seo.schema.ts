import { z } from "zod";

export const updateSeoSchema = z.object({
  searchKeywords: z.string().trim().optional(),
  customVisibility: z.string().trim().optional(),
});

export type UpdateSeoSchema = z.infer<typeof updateSeoSchema>;
