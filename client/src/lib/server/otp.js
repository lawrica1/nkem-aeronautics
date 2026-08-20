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

// No SMS/email provider is wired up yet — that's a separate decision (which
// provider, whose account, what cost), not something to guess at here. This
// logs server-side so the flow is debuggable. The `otpDebug` field callers
// attach in non-production responses is the only way to actually complete
// the flow today; both pieces MUST be replaced with a real provider before
// this goes anywhere near production.
export function sendOtp(channel, contact, code) {
  console.log(`[otp] would send ${channel} OTP ${code} to ${contact}`);
}
