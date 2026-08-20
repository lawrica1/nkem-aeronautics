import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDb } from "@/lib/server/db";
import { Farmer } from "@/lib/server/models/Farmer";
import { HttpError } from "@/lib/server/httpError";

const SALT_ROUNDS = 10;
const TOKEN_TTL = "30d";

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
