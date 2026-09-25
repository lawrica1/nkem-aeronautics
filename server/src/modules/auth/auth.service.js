import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma.js";
import { nextLogbookId } from "../logbooks/counter.model.js";
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
import { env } from "../../config/env.js";
import { notify } from "../notifications/notification.service.js";
import { checkPassword } from "../../shared/utils/loginGuard.js";

export async function signup(body) {
  validateSignup(body);

  const normalized = normalizeSignup(body);
  const existing = normalized.email
    ? await prisma.user.findUnique({ where: { email: normalized.email } })
    : await prisma.user.findFirst({ where: { telephone: normalized.telephone } });
  if (existing?.isVerified) {
    throw new HttpError(409, "An account with this contact already exists. Try logging in.");
  }

  // Send OTP to phone if provided, otherwise fall back to email
  const otpChannel = normalized.telephone ? "sms" : "email";
  const otpContact = otpChannel === "sms" ? normalized.telephone : normalized.email;
  limitOtpSend(otpChannel, otpContact);

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

  await sendOtp(otpChannel, otpContact, otp);
  return {
    message: "Verification code sent.",
    otpChannel,
    otpContact,
    ...(env.nodeEnv !== "production" ? { otpDebug: otp } : {}),
  };
}

export async function verifySignupOtp({ channel, contact, otp }) {
  if (!channel || !contact || !otp) {
    throw new HttpError(400, "channel, contact, and otp are required.");
  }

  const user = await prisma.user.findFirst({
    where: { isVerified: false, otpChannel: channel, otpContact: contact },
  });
  if (!user?.otpHash) throw new HttpError(400, "No pending verification found for this contact.");
  if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    throw new HttpError(400, "This verification code has expired. Request a new one.");
  }

  const valid = await verifyOtp(String(otp), user.otpHash);
  if (!valid) {
    if (recordOtpFailure(channel, contact)) {
      await prisma.user.update({ where: { id: user.id }, data: { otpHash: null, otpExpiresAt: null } });
      throw new HttpError(429, "Too many incorrect codes. Request a new verification code.");
    }
    throw new HttpError(400, "Invalid verification code.");
  }
  clearOtpFailures(channel, contact);

  const verifiedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      identificationNumber: await nextLogbookId(),
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

export async function resendSignupOtp({ channel, contact }) {
  if (!channel || !contact) throw new HttpError(400, "channel and contact are required.");
  if (!["sms", "email"].includes(channel)) throw new HttpError(400, "channel must be sms or email.");

  const user = await prisma.user.findFirst({
    where: {
      isVerified: false,
      OR: [{ otpContact: contact }, { telephone: contact }, { email: contact.toLowerCase() }],
    },
  });
  if (!user) throw new HttpError(400, "No pending verification found for this contact.");
  limitOtpSend(channel, contact);

  const otp = generateOtp();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      otpHash: await hashOtp(otp),
      otpChannel: channel,
      otpContact: contact,
      otpExpiresAt: otpExpiryDate(),
      otpResendCount: { increment: 1 },
      otpLastSentAt: new Date(),
    },
  });

  await sendOtp(channel, contact, otp);
  return {
    message: "Verification code resent.",
    ...(env.nodeEnv !== "production" ? { otpDebug: otp } : {}),
  };
}

export async function forgotPassword({ email, telephone }) {
  if (!email && !telephone) throw new HttpError(400, "email or phone number is required.");

  const user = await prisma.user.findFirst({
    where: {
      isVerified: true,
      ...(email ? { email: email.toLowerCase() } : { telephone }),
    },
  });

  // Always respond with success to prevent user enumeration
  if (!user) return { message: "If an account exists, a reset code has been sent." };

  const channel = telephone && user.telephone === telephone ? "sms" : "email";
  const contact = channel === "sms" ? user.telephone : user.email;

  limitOtpSend(channel, contact);
  const otp = generateOtp();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      otpHash: await hashOtp(otp),
      otpChannel: channel,
      otpContact: contact,
      otpExpiresAt: otpExpiryDate(),
      otpLastSentAt: new Date(),
    },
  });

  await sendOtp(channel, contact, otp);
  return {
    message: "If an account exists, a reset code has been sent.",
    otpChannel: channel,
    otpContact: contact,
    ...(env.nodeEnv !== "production" ? { otpDebug: otp } : {}),
  };
}

export async function resetPassword({ contact, otp, newPassword }) {
  if (!contact || !otp || !newPassword) {
    throw new HttpError(400, "contact, otp, and newPassword are required.");
  }
  if (newPassword.length < 8) throw new HttpError(400, "Password must be at least 8 characters.");

  const user = await prisma.user.findFirst({
    where: {
      isVerified: true,
      OR: [{ email: contact.toLowerCase() }, { telephone: contact }],
    },
  });
  if (!user?.otpHash) throw new HttpError(400, "No reset request found. Please request a new code.");
  if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    throw new HttpError(400, "This code has expired. Please request a new one.");
  }

  const valid = await verifyOtp(String(otp), user.otpHash);
  if (!valid) {
    if (recordOtpFailure(user.otpChannel, user.otpContact)) {
      await prisma.user.update({ where: { id: user.id }, data: { otpHash: null, otpExpiresAt: null } });
      throw new HttpError(429, "Too many incorrect codes. Please request a new one.");
    }
    throw new HttpError(400, "Invalid code.");
  }

  clearOtpFailures(user.otpChannel, user.otpContact);
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

  return { message: "Password updated successfully. You can now log in." };
}

export async function login({ email, telephone, password }) {
  if (!email && !telephone) throw new HttpError(400, "email or phone number is required.");
  if (!password) throw new HttpError(400, "password is required.");

  const user = await prisma.user.findFirst({
    where: {
      isVerified: true,
      ...(email ? { email: email.toLowerCase() } : { telephone }),
    },
  });

  if (user && !user.passwordHash) {
    throw new HttpError(400, "This account was created without a password. Please set a password through your profile settings.");
  }

  const identifier = email || telephone;
  await checkPassword("user", identifier, user?.passwordHash, password);
  return { token: signUserToken(user), role: user.role };
}
