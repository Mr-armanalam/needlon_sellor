import z from "zod";

export const signupSchema = z.object({
  firstname: z
    .string()
    .min(2, {
      message: "First Name must be at least 2 characters.",
    })
    .optional(),
  lastname: z
    .string()
    .min(2, {
      message: "Last Name must be at least 2 characters.",
    })
    .optional(),
  email: z.email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(2, {
    message: "Please enter a strong password.",
  }),

  pin: z
    .string()
    .min(6, {
      message: "Your one-time password must be 6 characters.",
    })
    .optional(),
});