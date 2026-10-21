import { z } from "zod";
import type { deliveryExecutives } from "@/db/schema/delivery/delivery-executives";
import type { deliveryAssignments } from "@/db/schema/delivery/delivery-assignments";

export type DeliveryExecutiveStatus =
  (typeof deliveryExecutives)["$inferSelect"]["status"];
export type DeliveryAssignmentStatus =
  (typeof deliveryAssignments)["$inferSelect"]["status"];

export const executiveStatusSchema = z.enum([
  "PENDING_VERIFICATION",
  "ACTIVE",
  "SUSPENDED",
  "INACTIVE",
]);

export const createExecutiveSchema = z.object({
  name: z.string().min(2, "Executive name is required"),
  phone: z.string().min(5, "Phone number is required"),
  email: z.string().email("Invalid email address").optional(),
  // Optional at creation: an executive without a password cannot log in
  // until one is set (password reset via the roster PATCH).
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
  vehicleType: z.string().optional(),
  vehicleNumber: z.string().optional(),
  licenseNumber: z.string().optional(),
  addressLine: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  status: executiveStatusSchema.optional(),
  isAvailable: z.boolean().optional(),
});

export const updateExecutiveSchema = z.object({
  name: z.string().min(2, "Executive name is required").optional(),
  phone: z.string().min(5, "Phone number is required").optional(),
  email: z.string().email("Invalid email address").nullable().optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
  vehicleType: z.string().nullable().optional(),
  vehicleNumber: z.string().nullable().optional(),
  licenseNumber: z.string().nullable().optional(),
  addressLine: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  pincode: z.string().nullable().optional(),
  status: executiveStatusSchema.optional(),
  isAvailable: z.boolean().optional(),
});

export const executiveLoginSchema = z.object({
  phone: z.string().min(5, "Phone number is required"),
  password: z.string().min(1, "Password is required"),
});

/** Statuses an executive may report for one of their own assignments. */
export const executiveAssignmentStatusSchema = z.object({
  status: z.enum(["ACCEPTED", "PICKED_UP", "DELIVERED", "FAILED"]),
  note: z.string().max(500).optional(),
});

export type CreateExecutiveDto = z.infer<typeof createExecutiveSchema>;
export type UpdateExecutiveDto = z.infer<typeof updateExecutiveSchema>;
export type ExecutiveLoginDto = z.infer<typeof executiveLoginSchema>;
export type ExecutiveAssignmentStatusDto = z.infer<
  typeof executiveAssignmentStatusSchema
>;

/**
 * Public executive shape returned by every roster / session API.
 * NEVER carries `passwordHash` — credential material stays in the
 * repository's internal auth record only.
 */
export interface ExecutiveDto {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  vehicleType: string | null;
  vehicleNumber: string | null;
  licenseNumber: string | null;
  addressLine: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  status: DeliveryExecutiveStatus;
  isAvailable: boolean;
  hasPassword: boolean;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExecutiveDeliveryAddressDto {
  recipientName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  deliveryNotes: string | null;
}

/** One assignment as the assigned executive sees it in their delivery list. */
export interface ExecutiveDeliveryDto {
  assignmentId: string;
  assignmentStatus: DeliveryAssignmentStatus;
  assignedAt: Date;
  acceptedAt: Date | null;
  pickedUpAt: Date | null;
  deliveredAt: Date | null;
  failureReason: string | null;
  shipmentId: string;
  shipmentStatus: string;
  awbNumber: string | null;
  trackingNumber: string | null;
  codAmount: string;
  orderId: string;
  orderNumber: string;
  buyerName: string | null;
  buyerPhone: string | null;
  itemsCount: number;
  deliveryAddress: ExecutiveDeliveryAddressDto | null;
}
