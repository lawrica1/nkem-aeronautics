import { Router } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { requireRole, requireUser } from "../../shared/middleware/auth.js";
import { ROLES } from "../platform/platform.constants.js";
import * as controller from "./idCard.controller.js";

export const idCardRouter = Router();

idCardRouter.use(requireUser, requireRole(ROLES.ADMIN));
idCardRouter.get("/", asyncHandler(controller.list));
idCardRouter.post("/", asyncHandler(controller.create));
idCardRouter.patch("/:id", asyncHandler(controller.update));
idCardRouter.delete("/:id", asyncHandler(controller.remove));
