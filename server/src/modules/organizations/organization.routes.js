import { Router } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { requireRole, requireUser } from "../../shared/middleware/auth.js";
import { ROLES } from "../platform/platform.constants.js";
import * as controller from "./organization.controller.js";

export const organizationRouter = Router();

organizationRouter.use(requireUser, requireRole(ROLES.ADMIN));
organizationRouter.get("/", asyncHandler(controller.list));
organizationRouter.post("/", asyncHandler(controller.create));
organizationRouter.patch("/:id", asyncHandler(controller.update));
