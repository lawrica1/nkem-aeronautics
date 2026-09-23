import { Router } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { requireRole, requireUser } from "../../shared/middleware/auth.js";
import { ROLES } from "../platform/platform.constants.js";
import * as controller from "./operation.controller.js";

export const operationRouter = Router();

operationRouter.use(requireUser);
operationRouter.get("/mine", requireRole(ROLES.PILOT), asyncHandler(controller.listMine));
operationRouter.post("/", requireRole(ROLES.ADMIN), asyncHandler(controller.assign));
operationRouter.patch("/:id", requireRole(ROLES.ADMIN), asyncHandler(controller.update));
operationRouter.patch("/:id/pilot-update", requireRole(ROLES.PILOT), asyncHandler(controller.updateAsPilot));
// Admin or the assigned pilot — ownership for pilots is enforced in the service layer.
operationRouter.post("/:id/media", requireRole(ROLES.PILOT, ROLES.ADMIN), asyncHandler(controller.attachMedia));
operationRouter.post("/:id/review", asyncHandler(controller.addReview));
