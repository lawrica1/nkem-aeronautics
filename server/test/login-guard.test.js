import { test } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { checkPassword } from "../src/shared/utils/loginGuard.js";

const hash = bcrypt.hashSync("right-password", 4);

test("the 6th attempt within 15 minutes is refused, even with the right password", async () => {
  for (let i = 0; i < 5; i++) {
    await assert.rejects(checkPassword("user", "a@x.com", hash, "wrong"), (e) => e.status === 401);
  }
  await assert.rejects(checkPassword("user", "a@x.com", hash, "right-password"), (e) => e.status === 429);
});

test("a successful sign-in clears the count", async () => {
  for (let i = 0; i < 4; i++) await assert.rejects(checkPassword("user", "b@x.com", hash, "wrong"));
  await checkPassword("user", "b@x.com", hash, "right-password");
  for (let i = 0; i < 4; i++) await assert.rejects(checkPassword("user", "b@x.com", hash, "wrong"), (e) => e.status === 401);
});

test("email case doesn't create a separate budget", async () => {
  for (let i = 0; i < 5; i++) await assert.rejects(checkPassword("admin", "C@X.com", hash, "wrong"));
  await assert.rejects(checkPassword("admin", "c@x.com", hash, "wrong"), (e) => e.status === 429);
});

test("a missing account still pays a full bcrypt compare before failing", async () => {
  const start = performance.now();
  await assert.rejects(checkPassword("user", "nobody@x.com", undefined, "anything"), (e) => e.status === 401);
  assert.ok(performance.now() - start > 10, "no-account path should not short-circuit");
});
