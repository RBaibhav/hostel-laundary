import { z } from "zod";
import { isValidObjectId } from "mongoose";

const id = z.string().trim().refine(isValidObjectId, "Invalid ID format");

export const startSessionSchema = z.object({
  machineId: id,
  duration: z
    .number()
    .int("Duration must be a whole number in minutes")
    .min(5, "Minimum session duration is 5 minutes")
    .max(180, "Maximum session duration is 180 minutes")
});

export const endSessionSchema = z.object({
  sessionId: id
});
