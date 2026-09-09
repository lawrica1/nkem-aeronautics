import { HttpError } from "../../shared/errors/HttpError.js";
import { ACTIVE_REGISTRATION_SECTORS, DEFAULT_COUNTRY } from "../platform/platform.constants.js";

export function validateSignup(body) {
  if (!body.email) throw new HttpError(400, "email is required.");
  if (!body.sector || !ACTIVE_REGISTRATION_SECTORS.includes(body.sector)) {
    throw new HttpError(400, `Please select a valid sector (${ACTIVE_REGISTRATION_SECTORS.join(", ")}).`);
  }

  // OTP-only mode: no password needed
  if (body.mode === "otp") return;

  if (!body.password) throw new HttpError(400, "password is required.");
}

export function normalizeSignup(body) {
  return {
    role: body.sector === "agricultural" ? "farmer" : "customer",
    sector: body.sector,
    country: body.country || DEFAULT_COUNTRY,
    telephone: body.telephone?.trim() || null,
    email: body.email.toLowerCase().trim(),
  };
}

export function validateProfileUpdate(body) {
  if (body.sector && !ACTIVE_REGISTRATION_SECTORS.includes(body.sector)) {
    throw new HttpError(400, "Invalid sector.");
  }
}
