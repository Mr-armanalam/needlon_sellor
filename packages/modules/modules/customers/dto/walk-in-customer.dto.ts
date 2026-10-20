import { z } from "zod";

export const createWalkInCustomerSchema = z.object({
  name: z.string().min(2, "Customer name must be at least 2 characters"),
  email: z.string().email("Valid email address is required"),
  phone: z.string().min(5, "Phone number must be at least 5 digits").optional().nullable(),
  gender: z.enum(["male", "female"]).default("male"),
  notes: z.string().optional().nullable(),
});

export type CreateWalkInCustomerDto = z.infer<typeof createWalkInCustomerSchema>;

/** Shape returned by `createOrLinkWalkInCustomerRepo` / the walk-in route. */
export interface WalkInCustomerResponseDto {
  userId: string;
  name: string;
  email: string;
  phone: string | null;
  isNewUser: boolean;
  createdInStore: boolean;
}
