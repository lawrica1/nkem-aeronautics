import { Router } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { requireRole, requireUser } from "../../shared/middleware/auth.js";
import { ROLES } from "../platform/platform.constants.js";
import * as controller from "./affiliate.controller.js";

export const affiliateRouter = Router();

affiliateRouter.use(requireUser, requireRole(ROLES.ADMIN));
affiliateRouter.get("/", asyncHandler(controller.list));
affiliateRouter.post("/", asyncHandler(controller.create));
affiliateRouter.patch("/:id", asyncHandler(controller.update));
affiliateRouter.delete("/:id", asyncHandler(controller.remove));
