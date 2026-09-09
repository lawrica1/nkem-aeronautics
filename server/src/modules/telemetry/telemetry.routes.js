import { Router } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { requireRole, requireUser } from "../../shared/middleware/auth.js";
import { ROLES } from "../platform/platform.constants.js";
import * as controller from "./telemetry.controller.js";

export const telemetryRouter = Router();

telemetryRouter.use(requireUser);
telemetryRouter.post("/", requireRole(ROLES.ADMIN), asyncHandler(controller.ingest));
telemetryRouter.get("/drone/:droneId", requireRole(ROLES.ADMIN), asyncHandler(controller.listForDrone));
telemetryRouter.get("/operation/:operationId", asyncHandler(controller.listForOperation));
