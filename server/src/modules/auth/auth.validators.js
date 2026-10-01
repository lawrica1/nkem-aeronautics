import { HttpError } from "../../shared/errors/HttpError.js";
import { ACTIVE_REGISTRATION_SECTORS } from "../platform/platform.constants.js";

export function validateSignup(body) {
  if (!body.email && !body.telephone) {
    throw new HttpError(400, "An email address or phone number is required.");
  }

  // OTP-only mode: no password needed
  if (body.mode === "otp") return;

  if (!body.password) throw new HttpError(400, "password is required.");
}

export function normalizeSignup(body) {
  return {
    role: "farmer",
    country: body.country,
    telephone: body.telephone?.trim() || null,
    email: body.email ? body.email.toLowerCase().trim() : null,
  };
}

export function validateProfileUpdate(body) {
  if (body.sector && !ACTIVE_REGISTRATION_SECTORS.includes(body.sector)) {
    throw new HttpError(400, "Invalid sector.");
  }
}
