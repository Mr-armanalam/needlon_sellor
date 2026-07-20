import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  parentId: z.string().nullable().optional(),
  description: z.string().optional(),
  iconUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
  displayOrder: z.number().default(0),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").optional(),
  parentId: z.string().nullable().optional(),
  description: z.string().optional(),
  iconUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
  displayOrder: z.number().optional(),
  isActive: z.boolean().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
