import { Router } from "express";
import { requireUser } from "../../shared/middleware/auth.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import * as controller from "./storage.controller.js";
import { uploadSingleFile } from "./upload.middleware.js";

export const storageRouter = Router();

storageRouter.post("/uploads", requireUser, uploadSingleFile, asyncHandler(controller.upload));
