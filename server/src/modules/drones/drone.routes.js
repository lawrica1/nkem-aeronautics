import { Router } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { requireRole, requireUser } from "../../shared/middleware/auth.js";
import { ROLES } from "../platform/platform.constants.js";
import * as controller from "./drone.controller.js";

export const droneRouter = Router();

droneRouter.use(requireUser, requireRole(ROLES.ADMIN));
droneRouter.get("/", asyncHandler(controller.list));
droneRouter.post("/", asyncHandler(controller.create));
droneRouter.patch("/:id", asyncHandler(controller.update));
