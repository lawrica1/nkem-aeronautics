import { HttpError } from "../errors/HttpError.js";

// ponytail: in-memory, per-process fixed windows. A restart or a second server instance
// resets the counts — move the buckets to Redis/Postgres if the API ever scales out.
const buckets = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) if (now >= bucket.resetAt) buckets.delete(key);
}, 60_000).unref();

export function hit(key, { limit, windowMs }) {
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }
  bucket.count += 1;
  return { allowed: bucket.count <= limit, count: bucket.count, retryAfterMs: bucket.resetAt - now };
}

export function reset(key) {
  buckets.delete(key);
}

export function enforce(key, options, message) {
  const result = hit(key, options);
  if (!result.allowed) {
    const minutes = Math.max(1, Math.ceil(result.retryAfterMs / 60_000));
    throw new HttpError(429, `${message} Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`);
  }
  return result;
}
