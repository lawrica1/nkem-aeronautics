import { Router } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { requireRole, requireUser } from "../../shared/middleware/auth.js";
import { ROLES } from "../platform/platform.constants.js";
import * as controller from "./admin.controller.js";

export const adminRouter = Router();

adminRouter.post("/login", asyncHandler(controller.login));
adminRouter.get("/stats", requireUser, requireRole(ROLES.ADMIN), asyncHandler(controller.stats));
adminRouter.get(
  "/logbooks/export",
  requireUser,
  requireRole(ROLES.ADMIN),
  asyncHandler(controller.exportLogbooks),
);
adminRouter.post("/logout", (_req, res) => res.json({ message: "Signed out." }));
