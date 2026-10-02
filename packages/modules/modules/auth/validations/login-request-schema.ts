import { z } from "zod";

export const loginRequestSchema = z.object({
  email: z
    .email("Invalid email")
    .trim()
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(8)
    .max(128),
});

export type LoginRequestInput =
  z.infer<typeof loginRequestSchema>;