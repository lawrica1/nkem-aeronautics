import { Router } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { logout, requireUser } from "../../shared/middleware/auth.js";
import * as controller from "./auth.controller.js";

export const authRouter = Router();

authRouter.post("/signup", asyncHandler(controller.signup));
authRouter.post("/verify-otp", asyncHandler(controller.verifyOtp));
authRouter.post("/resend-otp", asyncHandler(controller.resendOtp));
authRouter.post("/login", asyncHandler(controller.login));
authRouter.post("/forgot-password", asyncHandler(controller.forgotPassword));
authRouter.post("/reset-password", asyncHandler(controller.resetPassword));
authRouter.post("/logout", requireUser, logout);
