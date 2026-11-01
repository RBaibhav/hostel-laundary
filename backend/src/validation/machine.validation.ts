import { z } from "zod";
import { isValidObjectId } from "mongoose";

const id = z.string().refine(isValidObjectId, "Invalid machine ID format");

export const machineIdSchema = z.object({ id });

export const machineQuerySchema = z.object({
  status: z.enum(["AVAILABLE", "IN_USE", "OUT_OF_ORDER"]).optional()
});

export const createMachineSchema = z.object({
  machineNumber: z.string().trim().min(1, "Machine number is required"),
  location: z.string().trim().min(1, "Location is required")
});

export const updateMachineSchema = z.object({
  machineNumber: z.string().trim().min(1, "Machine number cannot be empty").optional(),
  location: z.string().trim().min(1, "Location cannot be empty").optional(),
  status: z.enum(["AVAILABLE", "IN_USE", "OUT_OF_ORDER"]).optional()
});
