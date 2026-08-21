// One-off admin account creation. There is no public admin-signup endpoint
// on purpose — this is the only way an admin account gets made.
//
// Usage (from client/):
//   node --env-file=.env.local scripts/create-admin.mjs you@example.com "a strong password" "Optional Name"

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Admin } from "../src/lib/server/models/Admin.js";

const [, , email, password, name] = process.argv;

if (!email || !password) {
  console.error('Usage: node --env-file=.env.local scripts/create-admin.mjs <email> <password> ["name"]');
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set. Pass --env-file=.env.local to node, or export it first.");
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);

const passwordHash = await bcrypt.hash(password, 10);

const admin = await Admin.findOneAndUpdate(
  { email: email.toLowerCase() },
  { email: email.toLowerCase(), passwordHash, name },
  { upsert: true, new: true, setDefaultsOnInsert: true },
);

console.log(`Admin ready: ${admin.email}`);
await mongoose.disconnect();
