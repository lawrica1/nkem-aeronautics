import { Router } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { requireRole, requireUser } from "../../shared/middleware/auth.js";
import { ROLES } from "../platform/platform.constants.js";
import * as controller from "./quote.controller.js";

export const quoteRouter = Router();

quoteRouter.post("/", asyncHandler(controller.create));
quoteRouter.get("/admin", requireUser, requireRole(ROLES.ADMIN), asyncHandler(controller.listAdmin));
quoteRouter.patch("/:id", requireUser, requireRole(ROLES.ADMIN), asyncHandler(controller.update));
