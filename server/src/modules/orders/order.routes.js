import { Router } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { requireRole, requireUser } from "../../shared/middleware/auth.js";
import { ROLES } from "../platform/platform.constants.js";
import * as controller from "./order.controller.js";

export const orderRouter = Router();

orderRouter.use(requireUser);
orderRouter.get("/mine", asyncHandler(controller.listMine));
orderRouter.post("/", asyncHandler(controller.createMine));
orderRouter.get("/:id/receipt", asyncHandler(controller.getReceipt));
orderRouter.get("/", requireRole(ROLES.ADMIN), asyncHandler(controller.listAdmin));
orderRouter.post("/admin", requireRole(ROLES.ADMIN), asyncHandler(controller.createAdmin));
orderRouter.patch("/:id/status", requireRole(ROLES.ADMIN), asyncHandler(controller.updateStatus));
orderRouter.post("/:id/payments", requireRole(ROLES.ADMIN), asyncHandler(controller.recordPayment));
