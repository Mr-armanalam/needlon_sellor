import { z } from "zod";

export const updateVariantsSchema = z.object({
  sizesMatrix: z.string().trim().optional(),
  colorsTrack: z.string().trim().optional(),
  fabricMaterial: z.string().trim().optional(),
  sleevesStyle: z.string().trim().optional(),
  fitType: z.string().trim().optional(),
  occasionFocus: z.string().trim().optional(),
  genderProfile: z.string().trim().optional(),
  targetAgeGroup: z.string().trim().optional(),
});

export type UpdateVariantsSchema = z.infer<typeof updateVariantsSchema>;
