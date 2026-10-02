import { z } from "zod";

export const verifyOtpSchema = z.object({
  email: z
    .email("Invalid email")
    .trim()
    .transform((value) => value.toLowerCase()),

  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be 6 digits"),

  type: z.enum(["signup", "reset"]),
});

export type VerifyOtpRequest = z.infer<
  typeof verifyOtpSchema
>;