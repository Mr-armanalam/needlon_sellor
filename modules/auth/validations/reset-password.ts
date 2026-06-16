import z from "zod";
export const resetPasswordRequestSchema = z.object({
  password: z.string().min(8).max(128),
  token: z.string().min(2),
});
