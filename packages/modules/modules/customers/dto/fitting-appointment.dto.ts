import { z } from "zod";

export const scheduleFittingAppointmentSchema = z.object({
  orderId: z.string().uuid("Invalid order ID"),
  customerId: z.string().uuid("Invalid customer ID"),
  scheduledAt: z.string().min(1, "Scheduled appointment time is required"),
  durationMinutes: z.number().int().positive().default(30),
  fittingNotes: z.string().optional(),
  tailorMasterName: z.string().optional(),
});

export type ScheduleFittingAppointmentDto = z.infer<typeof scheduleFittingAppointmentSchema>;

export const updateFittingAppointmentSchema = z.object({
  status: z.enum(["SCHEDULED", "COMPLETED", "RESCHEDULED", "CANCELLED"]).default("COMPLETED"),
  fittingNotes: z.string().optional(),
  alterationsRequired: z.boolean().default(false),
  alterationDetails: z.string().optional(),
  advanceTailoringStage: z.boolean().default(true), // Automatically moves order to FINAL_STITCH if perfect, or IN_CUTTING for alterations
});

export type UpdateFittingAppointmentDto = z.infer<typeof updateFittingAppointmentSchema>;

export const recordHandoverSchema = z.object({
  handoverNotes: z.string().optional(),
  markPaid: z.boolean().default(true),
});

export type RecordHandoverDto = z.infer<typeof recordHandoverSchema>;
