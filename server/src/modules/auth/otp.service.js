import bcrypt from "bcryptjs";
import { sendEmail } from "../notifications/email.service.js";
import { enforce, hit, reset } from "../../shared/utils/rateLimit.js";

const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_SALT_ROUNDS = 8;
export const OTP_MAX_FAILED_ATTEMPTS = 5;

function destinationKey(contact) {
  return `email:${String(contact).trim().toLowerCase()}`;
}

export function limitOtpSend(contact) {
  const key = destinationKey(contact);
  enforce(`otp-cooldown:${key}`, { limit: 1, windowMs: 60_000 }, "A code was just sent to this email.");
  enforce(`otp-hourly:${key}`, { limit: 5, windowMs: 60 * 60_000 }, "Too many codes sent to this email.");
  reset(`otp-fail:${key}`);
}

export function recordOtpFailure(contact) {
  return hit(`otp-fail:${destinationKey(contact)}`, {
    limit: OTP_MAX_FAILED_ATTEMPTS,
    windowMs: OTP_TTL_MS,
  }).count >= OTP_MAX_FAILED_ATTEMPTS;
}

export function clearOtpFailures(contact) {
  reset(`otp-fail:${destinationKey(contact)}`);
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

export function sendOtp(contact, code) {
  return sendEmail(
    contact,
    "Your Nkem Aeronautics verification code",
    `<p>Your verification code is <strong style="font-size:1.4em">${code}</strong></p><p>It expires in 10 minutes. If you did not request this, ignore this email.</p><p>— Nkem Aeronautics Ltd</p>`,
    { throwOnError: true },
  );
}
