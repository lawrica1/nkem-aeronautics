import { Router } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { requireRole, requireUser } from "../../shared/middleware/auth.js";
import { ROLES } from "../platform/platform.constants.js";
import * as controller from "./partner.controller.js";

export const partnerRouter = Router();

partnerRouter.use(requireUser, requireRole(ROLES.ADMIN));
partnerRouter.get("/", asyncHandler(controller.list));
partnerRouter.post("/", asyncHandler(controller.create));
