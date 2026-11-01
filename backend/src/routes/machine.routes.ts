import { Router } from "express";
import {
  getMachines,
  getMachineSummary,
  getMachineById
} from "../controllers/machine.controller";
import {
  createMachine,
  updateMachine,
  deleteMachine
} from "../controllers/admin.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";
import { validateBody, validateParams, validateQuery } from "../middleware/validate.middleware";
import {
  createMachineSchema,
  machineIdSchema,
  machineQuerySchema,
  updateMachineSchema
} from "../validation/machine.validation";

const router = Router();

router.get("/", validateQuery(machineQuerySchema), getMachines);
router.get("/summary", getMachineSummary);
router.get("/:id", validateParams(machineIdSchema), getMachineById);

router.post("/", authenticate, requireAdmin, validateBody(createMachineSchema), createMachine);
router.patch(
  "/:id",
  authenticate,
  requireAdmin,
  validateParams(machineIdSchema),
  validateBody(updateMachineSchema),
  updateMachine
);
router.delete("/:id", authenticate, requireAdmin, validateParams(machineIdSchema), deleteMachine);

export default router;
