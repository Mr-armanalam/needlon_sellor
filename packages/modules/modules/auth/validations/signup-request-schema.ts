import { z } from "zod";

export const signupRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(100),

  email: z
    .email()
    .trim()
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(8)
    .max(128)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/),
});

export type SignupRequestInput =
  z.infer<typeof signupRequestSchema>;