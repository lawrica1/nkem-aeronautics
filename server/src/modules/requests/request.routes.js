import { Router } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { requireRole, requireUser } from "../../shared/middleware/auth.js";
import { ROLES } from "../platform/platform.constants.js";
import * as controller from "./request.controller.js";

export const requestRouter = Router();

requestRouter.use(requireUser);
requestRouter.get("/mine", asyncHandler(controller.listMine));
requestRouter.post("/", asyncHandler(controller.createMine));
requestRouter.get("/partner/mine", requireRole(ROLES.PARTNER), asyncHandler(controller.listAsPartner));
requestRouter.get("/", requireRole(ROLES.ADMIN), asyncHandler(controller.listAdmin));
requestRouter.patch("/:id/status", requireRole(ROLES.ADMIN), asyncHandler(controller.updateAdminStatus));
requestRouter.patch("/:id/partner", requireRole(ROLES.ADMIN), asyncHandler(controller.assignPartner));
