import { z } from "zod";

export const customAttributeItemSchema = z.object({
  name: z.string().trim(),
  value: z.string().trim(),
});

export const updateVariantsSchema = z.object({
  sizesMatrix: z.string().trim().optional(),
  colorsTrack: z.string().trim().optional(),
  fabricMaterial: z.string().trim().optional(),
  sleevesStyle: z.string().trim().nullable().optional(),
  fitType: z.string().trim().nullable().optional(),
  occasionFocus: z.string().trim().nullable().optional(),
  genderProfile: z.string().trim().nullable().optional(),
  targetAgeGroup: z.string().trim().nullable().optional(),
  customAttributes: z.union([
    z.array(customAttributeItemSchema),
    z.string().transform((str) => {
      try {
        const parsed = JSON.parse(str);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }),
  ]).optional(),
});

export type UpdateVariantsSchema = z.infer<typeof updateVariantsSchema>;
