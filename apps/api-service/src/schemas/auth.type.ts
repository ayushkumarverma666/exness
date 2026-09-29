import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email().transform((e) => e.toLowerCase()),
  password: z.string().min(1, "Password is required"),
});

export const RegisterSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  email: z.email().transform((e) => e.toLowerCase()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128)
    .regex(/[A-Za-z]/, "Password must contain a letter")
    .regex(/[0-9]/, "Password must contain a number"),
});
