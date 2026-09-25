import { test } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { env } from "../src/config/env.js";
import { prisma } from "../src/config/prisma.js";
import { logout, requireUser, signUserToken } from "../src/shared/middleware/auth.js";
import { updateUser } from "../src/modules/admin/admin.service.js";

env.jwtSecret = "test-secret";
const users = new Map();
Object.defineProperty(prisma, "user", {
  configurable: true,
  value: {
    findUnique: async ({ where }) => users.get(where.id) ?? null,
    update: async ({ where, data }) => {
      const user = users.get(where.id);
      if (data.tokenVersion?.increment) user.tokenVersion = (user.tokenVersion ?? 0) + data.tokenVersion.increment;
      return user;
    },
  },
});

// Runs requireUser like Express would; resolves with the error passed to next(), or null.
function authenticate(token) {
  const req = { get: () => `Bearer ${token}` };
  return new Promise((resolve) => requireUser(req, {}, (error) => resolve(error ?? null)));
}

test("signing out ends every session issued before it", async () => {
  users.set("u1", { id: "u1", role: "farmer", isVerified: true, tokenVersion: 0 });
  const phone = signUserToken(users.get("u1"));
  const laptop = signUserToken(users.get("u1"));
  assert.equal(await authenticate(phone), null);

  await new Promise((resolve) => logout({ user: { id: "u1" } }, { json: resolve }, assert.fail));

  assert.equal((await authenticate(phone))?.status, 401);
  assert.equal((await authenticate(laptop))?.status, 401);
  assert.equal(await authenticate(signUserToken(users.get("u1"))), null, "a fresh sign-in works again");
});

test("tokens issued before this change (no tv claim) keep working until the first sign-out", async () => {
  users.set("u2", { id: "u2", role: "farmer", isVerified: true, tokenVersion: 0 });
  const legacy = jwt.sign({ sub: "u2", role: "farmer" }, "test-secret", { expiresIn: "30d" });
  assert.equal(await authenticate(legacy), null);
});

test("before the column exists (tokenVersion undefined), sign-in still works", async () => {
  users.set("u3", { id: "u3", role: "farmer", isVerified: true });
  assert.equal(await authenticate(signUserToken(users.get("u3"))), null);
});

test("an admin can sign another user out everywhere", async () => {
  users.set("u4", { id: "u4", role: "farmer", isVerified: true, tokenVersion: 0 });
  const token = signUserToken(users.get("u4"));
  prisma.$transaction = async (fn) => fn(prisma);
  await updateUser("u4", { revokeSessions: true }, { id: "admin" });
  assert.equal((await authenticate(token))?.status, 401);
});
