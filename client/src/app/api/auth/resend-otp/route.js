import { NextResponse } from "next/server";
import { connectDb } from "@/lib/server/db";
import { Farmer } from "@/lib/server/models/Farmer";
import { generateOtp, hashOtp, otpExpiryDate, sendOtp } from "@/lib/server/otp";
import { handleRoute } from "@/lib/server/handleRoute";
import { HttpError } from "@/lib/server/httpError";

export const POST = handleRoute(async (request) => {
  const { channel, contact } = await request.json();
  if (!channel || !contact) {
    throw new HttpError(400, "channel and contact are required.");
  }

  await connectDb();

  // Switching channel (see SignupView's "send it to my email/phone instead")
  // means the new contact won't match any existing otp.contact yet, so this
  // also matches on the farmer's own telephone/email directly.
  const farmer = await Farmer.findOne({
    isVerified: false,
    $or: [{ "otp.contact": contact }, { telephone: contact }, { email: contact.toLowerCase() }],
  });

  if (!farmer) {
    throw new HttpError(400, "No pending verification found for this contact.");
  }

  const otp = generateOtp();
  farmer.otp = {
    hash: await hashOtp(otp),
    channel,
    contact,
    expiresAt: otpExpiryDate(),
  };
  await farmer.save();

  sendOtp(channel, contact, otp);

  return NextResponse.json({
    message: "Verification code resent.",
    ...(process.env.NODE_ENV !== "production" ? { otpDebug: otp } : {}),
  });
});
