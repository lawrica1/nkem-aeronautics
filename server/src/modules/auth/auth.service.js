import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../shared/errors/HttpError.js";
import { signUserToken } from "../../shared/middleware/auth.js";
import {
  clearOtpFailures,
  generateOtp,
  hashOtp,
  limitOtpSend,
  otpExpiryDate,
  recordOtpFailure,
  sendOtp,
  verifyOtp,
} from "./otp.service.js";
import { normalizeSignup, validateSignup } from "./auth.validators.js";
import { ACTIVE_REGISTRATION_SECTORS } from "../platform/platform.constants.js";
import { env } from "../../config/env.js";
import { notify } from "../notifications/notification.service.js";
import { sendEmail } from "../notifications/email.service.js";
import { passwordChangedEmail } from "../notifications/email.templates.js";
import { checkPassword } from "../../shared/utils/loginGuard.js";

export async function signup(body) {
  validateSignup(body);

  const normalized = normalizeSignup(body);
  const existing = await prisma.user.findUnique({ where: { email: normalized.email } });
  if (existing?.isVerified) {
    throw new HttpError(409, "An account with this contact already exists. Try logging in.");
  }

  const otpChannel = "email";
  const otpContact = normalized.email;
  limitOtpSend(otpContact);

  const otp = generateOtp();
  const passwordHash = body.password ? await bcrypt.hash(body.password, 10) : null;
  const otpHash = await hashOtp(otp);
  const otpExpiresAt = otpExpiryDate();

  const otpData = {
    ...normalized,
    passwordHash,
    isVerified: false,
    otpHash,
    otpChannel,
    otpContact,
    otpExpiresAt,
    otpResendCount: 0,
    otpLastSentAt: new Date(),
  };

  if (existing) {
    await prisma.user.update({ where: { id: existing.id }, data: otpData });
  } else {
    await prisma.user.create({ data: otpData });
  }

  try {
    await sendOtp(otpContact, otp);
  } catch (err) {
    console.error(`[signup] OTP delivery failed (${otpChannel} → ${otpContact}): ${err.message}`);
    throw new HttpError(503, "Failed to send verification code. Please try again.");
  }
  return {
    message: "Verification code sent.",
    otpChannel,
    otpContact,
    ...(env.nodeEnv !== "production" ? { otpDebug: otp } : {}),
  };
}

export async function verifySignupOtp({ email, otp }) {
  if (!email || !otp) {
    throw new HttpError(400, "email and otp are required.");
  }

  const contact = email.toLowerCase().trim();

  const user = await prisma.user.findFirst({
    where: { isVerified: false, otpChannel: "email", otpContact: contact },
  });
  if (!user?.otpHash) throw new HttpError(400, "No pending verification found for this contact.");
  if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    throw new HttpError(400, "This verification code has expired. Request a new one.");
  }

  const valid = await verifyOtp(String(otp), user.otpHash);
  if (!valid) {
    if (recordOtpFailure(contact)) {
      await prisma.user.update({ where: { id: user.id }, data: { otpHash: null, otpExpiresAt: null } });
      throw new HttpError(429, "Too many incorrect codes. Request a new verification code.");
    }
    throw new HttpError(400, "Invalid verification code.");
  }
  clearOtpFailures(contact);

  const verifiedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      // identificationNumber is assigned when the user first sets their country during onboarding
      otpHash: null,
      otpChannel: null,
      otpContact: null,
      otpExpiresAt: null,
      otpLastSentAt: null,
    },
  });

  await notify(
    verifiedUser.id,
    {
      type: "account_verified",
      title: "Welcome to Nkem Aeronautics",
      body: `Your account is verified. Your Logbook ID is ${verifiedUser.identificationNumber}.`,
      link: "/logbook",
    },
    "Welcome to Nkem Aeronautics — your account is verified",
    `<p>Your account is verified.</p><p>Your Logbook ID is <strong>${verifiedUser.identificationNumber}</strong>.</p><p><a href="${env.clientOrigin}/logbook">Go to your Logbook</a></p><p>— Nkem Aeronautics Ltd</p>`,
  );

  return {
    token: signUserToken(verifiedUser),
    identificationNumber: verifiedUser.identificationNumber,
  };
}

export async function resendSignupOtp({ email }) {
  if (!email) throw new HttpError(400, "email is required.");
  const contact = email.toLowerCase().trim();

  const user = await prisma.user.findFirst({
    where: {
      isVerified: false,
      email: contact,
    },
  });
  if (!user) throw new HttpError(400, "No pending verification found for this contact.");
  limitOtpSend(contact);

  const otp = generateOtp();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      otpHash: await hashOtp(otp),
      otpChannel: "email",
      otpContact: contact,
      otpExpiresAt: otpExpiryDate(),
      otpResendCount: { increment: 1 },
      otpLastSentAt: new Date(),
    },
  });

  try {
    await sendOtp(contact, otp);
  } catch (err) {
    console.error(`[resend] OTP email delivery failed for ${contact}: ${err.message}`);
    throw new HttpError(503, "Failed to send verification code. Please try again.");
  }
  return {
    message: "Verification code resent.",
    ...(env.nodeEnv !== "production" ? { otpDebug: otp } : {}),
  };
}

export async function forgotPassword({ email }) {
  if (!email) throw new HttpError(400, "email is required.");
  const contact = email.toLowerCase().trim();

  const user = await prisma.user.findFirst({
    where: {
      isVerified: true,
      email: contact,
    },
  });

  // Always respond with success to prevent user enumeration
  if (!user) return { message: "If an account exists, a reset code has been sent." };

  limitOtpSend(contact);
  const otp = generateOtp();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      otpHash: await hashOtp(otp),
      otpChannel: "email",
      otpContact: contact,
      otpExpiresAt: otpExpiryDate(),
      otpLastSentAt: new Date(),
    },
  });

  try {
    await sendOtp(contact, otp);
  } catch (err) {
    console.error(`[forgot-password] OTP email delivery failed for ${contact}: ${err.message}`);
    throw new HttpError(503, "Failed to send reset code. Please try again.");
  }
  return {
    message: "If an account exists, a reset code has been sent.",
    email: contact,
    ...(env.nodeEnv !== "production" ? { otpDebug: otp } : {}),
  };
}

export async function resetPassword({ email, otp, newPassword }) {
  if (!email || !otp || !newPassword) {
    throw new HttpError(400, "email, otp, and newPassword are required.");
  }
  if (newPassword.length < 8) throw new HttpError(400, "Password must be at least 8 characters.");

  const user = await prisma.user.findFirst({
    where: {
      isVerified: true,
      email: email.toLowerCase().trim(),
    },
  });
  if (!user?.otpHash) throw new HttpError(400, "No reset request found. Please request a new code.");
  if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    throw new HttpError(400, "This code has expired. Please request a new one.");
  }

  const valid = await verifyOtp(String(otp), user.otpHash);
  if (!valid) {
    if (recordOtpFailure(user.otpContact)) {
      await prisma.user.update({ where: { id: user.id }, data: { otpHash: null, otpExpiresAt: null } });
      throw new HttpError(429, "Too many incorrect codes. Please request a new one.");
    }
    throw new HttpError(400, "Invalid code.");
  }

  clearOtpFailures(user.otpContact);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await bcrypt.hash(newPassword, 10),
      otpHash: null,
      otpChannel: null,
      otpContact: null,
      otpExpiresAt: null,
      otpLastSentAt: null,
    },
  });

  // Security confirmation — fire-and-forget
  if (user.email) {
    sendEmail(
      user.email,
      "Your password was changed — Nkem Aeronautics",
      passwordChangedEmail({ name: user.name }),
    ).catch((err) => console.error("[notify:password_changed]", err.message));
  }

  return { message: "Password updated successfully. You can now log in." };
}

export async function login({ email, password, sector }) {
  if (!email) throw new HttpError(400, "email is required.");
  if (!password) throw new HttpError(400, "password is required.");

  const user = await prisma.user.findFirst({
    where: {
      isVerified: true,
      email: email.toLowerCase().trim(),
    },
  });

  if (user && !user.passwordHash) {
    throw new HttpError(400, "This account was created without a password. Please set a password through your profile settings.");
  }

  await checkPassword("user", email, user?.passwordHash, password);

  // Persist the sector chosen at login time so the portal personalises correctly
  const sessionSector =
    sector && ACTIVE_REGISTRATION_SECTORS.includes(sector) ? sector : user.sector;
  let sessionUser = user;
  if (sessionSector && sessionSector !== user.sector) {
    sessionUser = await prisma.user.update({
      where: { id: user.id },
      data: { sector: sessionSector },
    });
  }

  return { token: signUserToken(sessionUser), role: sessionUser.role, sector: sessionSector };
}
