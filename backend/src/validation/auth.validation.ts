import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  roomNumber: z.string().trim().min(1, "Room number is required")
});

export const loginSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),
  password: z.string().min(1, "Password is required")
});
