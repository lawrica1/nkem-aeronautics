import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDb } from "@/lib/server/db";
import { Farmer } from "@/lib/server/models/Farmer";
import { Admin } from "@/lib/server/models/Admin";
import { HttpError } from "@/lib/server/httpError";

const SALT_ROUNDS = 10;
const TOKEN_TTL = "30d";
const ADMIN_TOKEN_TTL = "12h";
export const ADMIN_COOKIE = "nkem_admin";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set — add it to client/.env.local");
  }
  return secret;
}

export function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function signToken(farmerId) {
  return jwt.sign({ sub: String(farmerId) }, getJwtSecret(), { expiresIn: TOKEN_TTL });
}

export function verifyToken(token) {
  return jwt.verify(token, getJwtSecret());
}

// Reads the Bearer token, verifies it, and loads the associated Farmer.
// Throws HttpError(401) if anything about that chain is invalid.
export async function requireFarmer(request) {
  const authHeader = request.headers.get("authorization") ?? "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new HttpError(401, "Missing or invalid Authorization header.");
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new HttpError(401, "Invalid or expired token.");
  }

  await connectDb();
  const farmer = await Farmer.findById(payload.sub);
  if (!farmer || !farmer.isVerified) {
    throw new HttpError(401, "Account not found or not verified.");
  }

  return farmer;
}

// The `aud: "admin"` claim keeps a farmer's token from being replayed
// against an admin route (and vice versa) — they're both just JWTs signed
// with the same secret otherwise.
export function signAdminToken(adminId) {
  return jwt.sign({ sub: String(adminId), aud: "admin" }, getJwtSecret(), {
    expiresIn: ADMIN_TOKEN_TTL,
  });
}

// Reads the admin session cookie (not a Bearer header — the export routes
// need to work as plain <a href> downloads, which can't attach custom
// headers, so the session rides along as a cookie instead).
export async function requireAdmin(request) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) {
    throw new HttpError(401, "Not signed in.");
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new HttpError(401, "Invalid or expired session.");
  }

  if (payload.aud !== "admin") {
    throw new HttpError(401, "Invalid session.");
  }

  await connectDb();
  const admin = await Admin.findById(payload.sub);
  if (!admin) {
    throw new HttpError(401, "Account not found.");
  }

  return admin;
}
