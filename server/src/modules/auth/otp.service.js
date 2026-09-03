import bcrypt from "bcryptjs";

const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_SALT_ROUNDS = 8;

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

export function sendOtp(channel, contact, code) {
  console.log(`[otp:${channel}] ${code} -> ${contact}`);
}
