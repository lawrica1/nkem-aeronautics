import { NextResponse } from "next/server";
import { connectDb } from "@/lib/server/db";
import { Farmer } from "@/lib/server/models/Farmer";
import { verifyPassword, signToken } from "@/lib/server/auth";
import { handleRoute } from "@/lib/server/handleRoute";
import { HttpError } from "@/lib/server/httpError";

export const POST = handleRoute(async (request) => {
  const { email, password } = await request.json();
  if (!email || !password) {
    throw new HttpError(400, "email and password are required.");
  }

  await connectDb();

  const farmer = await Farmer.findOne({ email: email.toLowerCase(), isVerified: true });
  if (!farmer) {
    throw new HttpError(401, "Invalid email or password.");
  }

  const isValid = await verifyPassword(password, farmer.passwordHash);
  if (!isValid) {
    throw new HttpError(401, "Invalid email or password.");
  }

  const token = signToken(farmer._id);
  return NextResponse.json({ token });
});
