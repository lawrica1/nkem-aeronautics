import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma.js";
import { nextLogbookId } from "../logbooks/counter.model.js";
import { HttpError } from "../../shared/errors/HttpError.js";
import { signUserToken } from "../../shared/middleware/auth.js";
import { generateOtp, hashOtp, otpExpiryDate, sendOtp, verifyOtp } from "./otp.service.js";
import { normalizeSignup, validateSignup } from "./auth.validators.js";
import { env } from "../../config/env.js";

export async function signup(body) {
  validateSignup(body);

  const normalized = normalizeSignup(body);
  const existing = await prisma.user.findUnique({ where: { email: normalized.email } });
  if (existing?.isVerified) {
    throw new HttpError(409, "An account with this email already exists. Try logging in.");
  }

  const otp = generateOtp();
  const passwordHash = await bcrypt.hash(body.password, 10);
  const otpHash = await hashOtp(otp);
  const otpExpiresAt = otpExpiryDate();

  await prisma.user.upsert({
    where: { email: normalized.email },
    create: {
      ...normalized,
      passwordHash,
      isVerified: false,
      otpHash,
      otpChannel: "sms",
      otpContact: normalized.telephone,
      otpExpiresAt,
      otpResendCount: 0,
      otpLastSentAt: new Date(),
    },
    update: {
      ...normalized,
      passwordHash,
      isVerified: false,
      otpHash,
      otpChannel: "sms",
      otpContact: normalized.telephone,
      otpExpiresAt,
      otpResendCount: 0,
      otpLastSentAt: new Date(),
    },
  });

  sendOtp("sms", normalized.telephone, otp);
  return {
    message: "Verification code sent.",
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

  const valid = await verifyOtp(otp, user.otpHash);
  if (!valid) throw new HttpError(400, "Invalid verification code.");

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

  return {
    token: signUserToken(verifiedUser),
    identificationNumber: verifiedUser.identificationNumber,
  };
}

export async function resendSignupOtp({ channel, contact }) {
  if (!channel || !contact) throw new HttpError(400, "channel and contact are required.");

  const user = await prisma.user.findFirst({
    where: {
      isVerified: false,
      OR: [{ otpContact: contact }, { telephone: contact }, { email: contact.toLowerCase() }],
    },
  });
  if (!user) throw new HttpError(400, "No pending verification found for this contact.");

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

  sendOtp(channel, contact, otp);
  return {
    message: "Verification code resent.",
    ...(env.nodeEnv !== "production" ? { otpDebug: otp } : {}),
  };
}

export async function login({ email, password }) {
  if (!email || !password) throw new HttpError(400, "email and password are required.");

  const user = await prisma.user.findFirst({
    where: { email: email.toLowerCase(), isVerified: true },
  });
  if (!user) throw new HttpError(401, "Invalid email or password.");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new HttpError(401, "Invalid email or password.");

  return { token: signUserToken(user) };
}
