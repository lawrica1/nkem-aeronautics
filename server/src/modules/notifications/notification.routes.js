import { Router } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { requireUser } from "../../shared/middleware/auth.js";
import * as controller from "./notification.controller.js";

export const notificationRouter = Router();

notificationRouter.use(requireUser);
notificationRouter.get("/mine", asyncHandler(controller.listMine));
notificationRouter.patch("/read-all", asyncHandler(controller.markAllRead));
notificationRouter.patch("/:id/read", asyncHandler(controller.markRead));
