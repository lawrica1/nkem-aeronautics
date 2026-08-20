import { NextResponse } from "next/server";
import { connectDb } from "@/lib/server/db";
import { Farmer } from "@/lib/server/models/Farmer";
import { nextFarmerId } from "@/lib/server/models/Counter";
import { signToken } from "@/lib/server/auth";
import { verifyOtp as checkOtp } from "@/lib/server/otp";
import { handleRoute } from "@/lib/server/handleRoute";
import { HttpError } from "@/lib/server/httpError";

export const POST = handleRoute(async (request) => {
  const { channel, contact, otp } = await request.json();
  if (!channel || !contact || !otp) {
    throw new HttpError(400, "channel, contact, and otp are required.");
  }

  await connectDb();

  const farmer = await Farmer.findOne({
    isVerified: false,
    "otp.channel": channel,
    "otp.contact": contact,
  });

  if (!farmer?.otp) {
    throw new HttpError(400, "No pending verification found for this contact.");
  }

  if (farmer.otp.expiresAt < new Date()) {
    throw new HttpError(400, "This verification code has expired. Request a new one.");
  }

  const isValid = await checkOtp(otp, farmer.otp.hash);
  if (!isValid) {
    throw new HttpError(400, "Invalid verification code.");
  }

  farmer.isVerified = true;
  farmer.identificationNumber = await nextFarmerId();
  farmer.otp = undefined;
  await farmer.save();

  const token = signToken(farmer._id);

  return NextResponse.json({ token, identificationNumber: farmer.identificationNumber });
});
