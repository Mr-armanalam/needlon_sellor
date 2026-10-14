import { z } from "zod";
import { TAILORING_STAGES } from "@/db/schema/orders/constants";

export const createInStoreOrderSchema = z.object({
  customerId: z.string().uuid("Valid customer ID is required"),
  measurementId: z.string().uuid().optional().nullable(),
  garmentName: z.string().min(2, "Garment item name is required"),
  amount: z.number().positive("Order amount must be greater than zero"),
  tailoringStage: z.enum(TAILORING_STAGES).default("ORDER_PLACED"),
  tailoringNotes: z.string().optional().nullable(),
  paymentStatus: z.enum(["PENDING", "PAID", "PARTIAL"]).default("PAID"),
  paymentMethod: z.enum(["CASH", "CARD", "UPI", "COD"]).default("CASH"),
  imageUrl: z.string().optional().nullable(),
  mediaUrls: z.array(z.string()).optional(),
  deliveryMethod: z.enum(["STORE_PICKUP", "HOME_DELIVERY"]).default("STORE_PICKUP"),
  shippingPartnerId: z.string().optional().nullable(),
  estimatedDeliveryAt: z.string().optional().nullable(),
  shippingAddress: z
    .object({
      recipientName: z.string().optional(),
      phoneNumber: z.string().optional(),
      addressLine1: z.string().min(1, "Street address is required"),
      addressLine2: z.string().optional(),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
      postalCode: z.string().min(1, "Postal code is required"),
    })
    .optional()
    .nullable(),
});

export type CreateInStoreOrderDto = z.infer<typeof createInStoreOrderSchema>;

export const updateTailoringStageSchema = z.object({
  stage: z.enum(TAILORING_STAGES),
  notes: z.string().optional().nullable(),
});

export type UpdateTailoringStageDto = z.infer<typeof updateTailoringStageSchema>;
