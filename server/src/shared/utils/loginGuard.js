import bcrypt from "bcryptjs";
import { HttpError } from "../errors/HttpError.js";
import { enforce, reset } from "./rateLimit.js";

// A real cost-10 hash, so "no such account" pays the same bcrypt time as "wrong password".
const DUMMY_HASH = bcrypt.hashSync("nkem-timing-equalizer", 10);

// Up to 5 attempts per email per 15 minutes; a successful sign-in clears the count.
// Keyed by email (the target), so it holds behind any proxy — but it also means repeated
// wrong guesses can pause sign-in for that one account for up to 15 minutes.
export async function checkPassword(scope, email, passwordHash, password) {
  const key = `login:${scope}:${String(email).toLowerCase()}`;
  enforce(key, { limit: 5, windowMs: 15 * 60_000 }, "Too many sign-in attempts for this account.");

  const valid = await bcrypt.compare(String(password), passwordHash || DUMMY_HASH);
  if (!valid || !passwordHash) throw new HttpError(401, "Invalid email or password.");
  reset(key);
}
