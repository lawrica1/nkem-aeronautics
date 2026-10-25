import { HttpError } from "../../shared/errors/HttpError.js";
import { ACTIVE_REGISTRATION_SECTORS } from "../platform/platform.constants.js";

export function validateSignup(body) {
  if (!body.email) throw new HttpError(400, "email is required.");
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
