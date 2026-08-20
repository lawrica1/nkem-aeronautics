import { NextResponse } from "next/server";
import { connectDb } from "@/lib/server/db";
import { Farmer } from "@/lib/server/models/Farmer";
import { hashPassword } from "@/lib/server/auth";
import { generateOtp, hashOtp, otpExpiryDate, sendOtp } from "@/lib/server/otp";
import { handleRoute } from "@/lib/server/handleRoute";
import { HttpError } from "@/lib/server/httpError";
import { FIRM_OPTIONS } from "@/lib/firms";

const FIRM_VALUES = new Set(FIRM_OPTIONS.map((firm) => firm.value));

function validate(body) {
  const required = ["sector", "surname", "name", "telephone", "email", "address", "password"];
  for (const field of required) {
    if (!body[field]) throw new HttpError(400, `${field} is required.`);
  }

  if (body.sector === "agricultural") {
    if (!body.crop) throw new HttpError(400, "crop is required for agricultural sign-ups.");
    if (!body.firm || !FIRM_VALUES.has(body.firm)) {
      throw new HttpError(400, "A valid firm affiliation is required.");
    }
    if (body.firm === "other" && !body.otherFirm) {
      throw new HttpError(400, "otherFirm is required when firm is 'other'.");
    }
  }

  if (body.sector === "wildlife") {
    if (!body.wildlifeOrg || !body.wildlifeRole) {
      throw new HttpError(400, "wildlifeOrg and wildlifeRole are required for wildlife sign-ups.");
    }
  }
}

export const POST = handleRoute(async (request) => {
  const body = await request.json();
  validate(body);

  await connectDb();

  const existing = await Farmer.findOne({ email: body.email.toLowerCase(), isVerified: true });
  if (existing) {
    throw new HttpError(409, "An account with this email already exists. Try logging in.");
  }

  const passwordHash = await hashPassword(body.password);
  const otp = generateOtp();
  const otpHash = await hashOtp(otp);
  const channel = "sms";

  await Farmer.findOneAndUpdate(
    { email: body.email.toLowerCase(), isVerified: false },
    {
      sector: body.sector,
      surname: body.surname,
      name: body.name,
      sex: body.sex,
      telephone: body.telephone,
      email: body.email.toLowerCase(),
      address: body.address,
      crop: body.crop,
      firm: body.firm,
      otherFirm: body.otherFirm,
      wildlifeOrg: body.wildlifeOrg,
      wildlifeRole: body.wildlifeRole,
      passwordHash,
      isVerified: false,
      otp: { hash: otpHash, channel, contact: body.telephone, expiresAt: otpExpiryDate() },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  sendOtp(channel, body.telephone, otp);

  return NextResponse.json({
    message: "Verification code sent.",
    ...(process.env.NODE_ENV !== "production" ? { otpDebug: otp } : {}),
  });
});
