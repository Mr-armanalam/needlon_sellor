import { z } from "zod";

export const updateDeliverySchema = z.object({
  pickupHubAddress: z.string().trim().optional(),
  packageWeight: z.union([z.string(), z.number()]).transform((val) => String(val)).optional(),
  deliveryRadiusRange: z.string().trim().optional(),
  estimatedDeliveryWindow: z.string().trim().optional(),
});

export type UpdateDeliverySchema = z.infer<typeof updateDeliverySchema>;
