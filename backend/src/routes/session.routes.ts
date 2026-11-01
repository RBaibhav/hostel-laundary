import { Router } from "express";
import {
  startSession,
  endSession,
  getMyActiveSession,
  getMySessionHistory
} from "../controllers/session.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import { endSessionSchema, startSessionSchema } from "../validation/session.validation";

const router = Router();

router.use(authenticate);

router.post("/start", validateBody(startSessionSchema), startSession);
router.patch("/end", validateBody(endSessionSchema), endSession);
router.get("/my-active", getMyActiveSession);
router.get("/my-history", getMySessionHistory);

export default router;
