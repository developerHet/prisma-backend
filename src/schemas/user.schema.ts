import { z } from "zod";

export const userRegistrationSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6),
});
