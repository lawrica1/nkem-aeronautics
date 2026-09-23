import { test } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { env } from "../src/config/env.js";
import { signAdminToken, signUserToken, verifyToken } from "../src/shared/middleware/auth.js";

env.jwtSecret = "test-secret";

test("admin tokens last 12 hours, user tokens 30 days", () => {
  const admin = jwt.decode(signAdminToken({ id: "a" }));
  const user = jwt.decode(signUserToken({ id: "u", role: "farmer" }));
  assert.equal(admin.exp - admin.iat, 12 * 3600);
  assert.equal(user.exp - user.iat, 30 * 86400);
  assert.equal(verifyToken(signAdminToken({ id: "a" })).sub, "a");
});

test("unsigned (alg: none) and other-algorithm tokens are rejected", () => {
  const none = jwt.sign({ sub: "a", role: "admin" }, null, { algorithm: "none" });
  assert.throws(() => verifyToken(none));
  const hs512 = jwt.sign({ sub: "a" }, "test-secret", { algorithm: "HS512" });
  assert.throws(() => verifyToken(hs512));
});
