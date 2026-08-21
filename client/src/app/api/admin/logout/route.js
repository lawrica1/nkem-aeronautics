import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/server/auth";

export async function POST() {
  const response = NextResponse.json({ message: "Signed out." });
  response.cookies.delete(ADMIN_COOKIE);
  return response;
}
