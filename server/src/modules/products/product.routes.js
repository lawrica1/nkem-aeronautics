import { Router } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { requireRole, requireUser } from "../../shared/middleware/auth.js";
import { ROLES } from "../platform/platform.constants.js";
import * as controller from "./product.controller.js";

export const productRouter = Router();

productRouter.get("/", asyncHandler(controller.list));
productRouter.get("/admin", requireUser, requireRole(ROLES.ADMIN), asyncHandler(controller.listAdmin));
productRouter.get("/slug/:slug", asyncHandler(controller.getBySlug));
productRouter.post("/", requireUser, requireRole(ROLES.ADMIN), asyncHandler(controller.create));
productRouter.patch("/:id", requireUser, requireRole(ROLES.ADMIN), asyncHandler(controller.update));
