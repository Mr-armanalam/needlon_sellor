import { z } from "zod";

export const updateSeoSchema = z.object({
  searchKeywords: z.string().trim().optional(),
  customVisibility: z.enum(["PUBLIC", "PRIVATE", "UNLISTED"]).optional(),
  slug: z.string().trim().optional(),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
  canonicalUrl: z.string().trim().optional(),
  ogTitle: z.string().trim().optional(),
  ogDescription: z.string().trim().optional(),
  ogImage: z.string().trim().optional(),
  twitterTitle: z.string().trim().optional(),
  twitterDescription: z.string().trim().optional(),
  twitterImage: z.string().trim().optional(),
});

export type UpdateSeoSchema = z.infer<typeof updateSeoSchema>;
