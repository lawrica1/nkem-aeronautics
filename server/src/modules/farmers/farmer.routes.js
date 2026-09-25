import { Router } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { requireUser } from "../../shared/middleware/auth.js";
import { uploadProfilePhoto } from "../storage/upload.middleware.js";
import * as controller from "./farmer.controller.js";

export const farmerRouter = Router();

farmerRouter.use(requireUser);
farmerRouter.get("/me", controller.me);
farmerRouter.patch("/me", asyncHandler(controller.updateProfile));
farmerRouter.get("/logbook", asyncHandler(controller.logbook));
farmerRouter.patch("/me/photo", uploadProfilePhoto, asyncHandler(controller.updatePhoto));
farmerRouter.get("/service-requests", asyncHandler(async (req, res) => {
  const { listForUser } = await import("../requests/request.service.js");
  res.json(await listForUser(req.user));
}));
farmerRouter.post("/service-requests", asyncHandler(async (req, res) => {
  const { createForUser } = await import("../requests/request.service.js");
  res.status(201).json(await createForUser(req.user, req.body));
}));
