import bcrypt from "bcryptjs";
import { env } from "../../config/env.js";

const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_SALT_ROUNDS = 8;
const TERMII_SEND_URL = "https://api.ng.termii.com/api/sms/send";

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

  console.log(`[otp:${channel}] ${code} -> ${contact}`);
}
