import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Cached on `global` (not module scope) so Next's dev-mode hot reload
// doesn't spawn a fresh connection on every route-handler recompile.
let cached = global._mongoose;
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

export async function connectDb() {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set — add it to client/.env.local");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
