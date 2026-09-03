import { HttpError } from "../../shared/errors/HttpError.js";
import { DEFAULT_COUNTRY } from "../platform/platform.constants.js";

const VALID_SECTORS = ["agricultural", "wildlife", "realestate"];

export function validateSignup(body) {
  if (!body.email) throw new HttpError(400, "email is required.");
  if (!body.sector || !VALID_SECTORS.includes(body.sector)) {
    throw new HttpError(400, "Please select a valid sector (agricultural, wildlife, or realestate).");
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
  const VALID_SECTORS = ["agricultural", "wildlife", "realestate"];
  if (body.sector && !VALID_SECTORS.includes(body.sector)) {
    throw new HttpError(400, "Invalid sector.");
  }
}
