import { Router } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { requireUser } from "../../shared/middleware/auth.js";
import * as controller from "./payment.controller.js";

export const paymentRouter = Router();

// No requireUser here — Flutterwave's servers call this directly, authenticated only by
// the verif-hash header (checked inside the controller), not a customer JWT.
paymentRouter.post("/webhook", asyncHandler(controller.webhook));

paymentRouter.use(requireUser);
paymentRouter.post("/orders/:orderId/checkout", asyncHandler(controller.startCheckout));
paymentRouter.get("/confirm", asyncHandler(controller.confirm));
