import { z } from "zod";

export const recordInStoreMeasurementSchema = z.object({
  userId: z.string().uuid("Valid customer user ID is required"),
  gender: z.enum(["menswear", "womenswear"]),
  garmentType: z.string().min(2, "Garment type is required"),
  measurementUnit: z.enum(["INCHES", "CM"]).default("INCHES"),
  essentialMeasurements: z.record(z.union([z.number(), z.string()])),
  postureSpecifics: z.record(z.union([z.number(), z.string()])).optional().default({}),
  fitPreference: z.enum(["SLIM", "REGULAR", "COMFORT"]).default("REGULAR"),
  tailorNotes: z.string().optional().nullable(),
});

export type RecordInStoreMeasurementDto = z.infer<typeof recordInStoreMeasurementSchema>;
