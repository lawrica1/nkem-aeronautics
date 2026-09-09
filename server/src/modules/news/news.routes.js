import { Router } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { requireRole, requireUser } from "../../shared/middleware/auth.js";
import { ROLES } from "../platform/platform.constants.js";
import * as controller from "./news.controller.js";

export const newsRouter = Router();

newsRouter.get("/", asyncHandler(controller.list));
newsRouter.get("/admin", requireUser, requireRole(ROLES.ADMIN), asyncHandler(controller.listAdmin));
newsRouter.post("/", requireUser, requireRole(ROLES.ADMIN), asyncHandler(controller.create));
newsRouter.patch("/:id", requireUser, requireRole(ROLES.ADMIN), asyncHandler(controller.update));
