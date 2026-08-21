import { NextResponse } from "next/server";
import { connectDb } from "@/lib/server/db";
import { Admin } from "@/lib/server/models/Admin";
import { verifyPassword, signAdminToken, ADMIN_COOKIE } from "@/lib/server/auth";
import { handleRoute } from "@/lib/server/handleRoute";
import { HttpError } from "@/lib/server/httpError";

export const POST = handleRoute(async (request) => {
  const { email, password } = await request.json();
  if (!email || !password) {
    throw new HttpError(400, "email and password are required.");
  }

  await connectDb();

  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) {
    throw new HttpError(401, "Invalid email or password.");
  }

  const isValid = await verifyPassword(password, admin.passwordHash);
  if (!isValid) {
    throw new HttpError(401, "Invalid email or password.");
  }

  const token = signAdminToken(admin._id);
  const response = NextResponse.json({ message: "Signed in." });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
});
