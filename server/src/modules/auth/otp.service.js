import bcrypt from "bcryptjs";
import { env } from "../../config/env.js";
import { sendEmail } from "../notifications/email.service.js";
import { enforce, hit, reset } from "../../shared/utils/rateLimit.js";

const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_SALT_ROUNDS = 8;
const TERMII_SEND_URL = "https://v4.api.termii.com/api/sms/send";
export const OTP_MAX_FAILED_ATTEMPTS = 5;

// Keyed by the destination, not the caller: the harm (SMS spend, harassment, guessing)
// lands on the number/inbox, and "+237 670…" and "237670…" must share one bucket.
function destinationKey(channel, contact) {
  const value = channel === "sms" ? String(contact).replace(/\D/g, "") : String(contact).trim().toLowerCase();
  return `${channel}:${value}`;
}

// Call before writing a new code to the DB, so a refused send never invalidates the current code.
export function limitOtpSend(channel, contact) {
  const key = destinationKey(channel, contact);
  enforce(`otp-cooldown:${key}`, { limit: 1, windowMs: 60_000 }, "A code was just sent to this contact.");
  enforce(`otp-hourly:${key}`, { limit: 5, windowMs: 60 * 60_000 }, "Too many codes sent to this contact.");
  reset(`otp-fail:${key}`);
}

// Returns true once this code has taken too many wrong guesses and must be discarded.
export function recordOtpFailure(channel, contact) {
  return hit(`otp-fail:${destinationKey(channel, contact)}`, { limit: OTP_MAX_FAILED_ATTEMPTS, windowMs: OTP_TTL_MS }).count >= OTP_MAX_FAILED_ATTEMPTS;
}

export function clearOtpFailures(channel, contact) {
  reset(`otp-fail:${destinationKey(channel, contact)}`);
}

export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function hashOtp(otp) {
  return bcrypt.hash(otp, OTP_SALT_ROUNDS);
}

export function verifyOtp(otp, hash) {
  return bcrypt.compare(otp, hash);
}

export function otpExpiryDate() {
  return new Date(Date.now() + OTP_TTL_MS);
}

// Termii expects a bare international number, e.g. "237670000000" — no "+", spaces, or dashes.
// The signup form already prompts farmers for a "+237 670 000 000"-style number, so this is
// just cleanup, not country-code inference.
function normalizePhone(contact) {
  return contact.replace(/[^\d+]/g, "").replace(/^\+/, "");
}

async function sendSms(to, message) {
  const response = await fetch(TERMII_SEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: normalizePhone(to),
      from: env.termiiSenderId,
      sms: message,
      type: "plain",
      channel: env.termiiChannel,
      api_key: env.termiiApiKey,
    }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || data?.code === "ERROR") {
    throw new Error(data?.message || `Termii request failed with status ${response.status}`);
  }
}

export async function sendOtp(channel, contact, code) {
  const message = `Your Nkem Aeronautics verification code is ${code}. It expires in 10 minutes.`;

  if (channel === "sms" && env.termiiApiKey) {
    try {
      await sendSms(contact, message);
      return;
    } catch (error) {
      // Don't let a provider outage fail signup/resend — the OTP is still valid and the
      // farmer can request another code. Just make the failure visible in the server log.
      console.error(`[otp:sms] Termii send failed for ${contact}: ${error.message}`);
    }
  }

  if (channel === "email") {
    await sendEmail(
      contact,
      "Your Nkem Aeronautics verification code",
      `<p>Your verification code is <strong style="font-size:1.4em">${code}</strong></p><p>It expires in 10 minutes. If you did not request this, ignore this email.</p><p>— Nkem Aeronautics Ltd</p>`,
    );
    return;
  }

  console.log(`[otp:${channel}] ${code} -> ${contact}`);
}
