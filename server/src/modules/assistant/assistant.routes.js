import { Router } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import * as controller from "./assistant.controller.js";

// Public website assistant: no login required, rate-limited per visitor IP.
export const assistantRouter = Router();

assistantRouter.post("/chat", asyncHandler(controller.chat));
