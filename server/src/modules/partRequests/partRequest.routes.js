import { Router } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { requireRole, requireUser } from "../../shared/middleware/auth.js";
import { ROLES } from "../platform/platform.constants.js";
import * as controller from "./partRequest.controller.js";

export const partRequestRouter = Router();

partRequestRouter.use(requireUser);
partRequestRouter.get("/mine", asyncHandler(controller.listMine));
partRequestRouter.post("/", asyncHandler(controller.createMine));
partRequestRouter.get("/", requireRole(ROLES.ADMIN), asyncHandler(controller.listAdmin));
partRequestRouter.patch("/:id", requireRole(ROLES.ADMIN), asyncHandler(controller.update));
