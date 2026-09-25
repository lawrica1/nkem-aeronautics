import { Router } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { requireRole, requireUser } from "../../shared/middleware/auth.js";
import { ROLES } from "../platform/platform.constants.js";
import * as controller from "./pilot.controller.js";

export const pilotRouter = Router();

pilotRouter.use(requireUser, requireRole(ROLES.ADMIN));
pilotRouter.get("/", asyncHandler(controller.list));
pilotRouter.post("/", asyncHandler(controller.create));
pilotRouter.patch("/:id", asyncHandler(controller.update));
