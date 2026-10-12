import { z } from "zod";

export const updateSeoSchema = z.object({
  searchKeywords: z.string().trim().optional().nullable(),
  customVisibility: z.enum(["PUBLIC", "PRIVATE", "UNLISTED"]).optional(),
  slug: z.string().trim().optional().nullable(),
  metaTitle: z.string().trim().optional().nullable(),
  metaDescription: z.string().trim().optional().nullable(),
  canonicalUrl: z.string().trim().optional().nullable(),
  ogTitle: z.string().trim().optional().nullable(),
  ogDescription: z.string().trim().optional().nullable(),
  ogImage: z.string().trim().optional().nullable(),
  twitterTitle: z.string().trim().optional().nullable(),
  twitterDescription: z.string().trim().optional().nullable(),
  twitterImage: z.string().trim().optional().nullable(),
});

export type UpdateSeoSchema = z.infer<typeof updateSeoSchema>;
