import { test } from "node:test";
import assert from "node:assert/strict";
import { env } from "../src/config/env.js";
import { prisma } from "../src/config/prisma.js";
import { reset } from "../src/shared/utils/rateLimit.js";
import { signup } from "../src/modules/admin/admin.service.js";

const body = { name: "New Admin", email: "New@x.com", password: "password123" };
let created;
prisma.user.create = async ({ data }) => (created = { id: "u1", ...data });
env.jwtSecret ||= "test-secret";
env.brevoApiKey = undefined;
env.smtpPass = undefined;

function fresh() {
  env.adminEmail = "inbox@x.com";
  reset("admin-signup");
  created = undefined;
}

test("signup is disabled when no ADMIN_EMAIL is configured", async () => {
  fresh();
  env.adminEmail = "";
  await assert.rejects(signup(body), /disabled/);
  assert.equal(created, undefined);
});

test("signup creates a verified admin and returns a token", async () => {
  fresh();
  const { token } = await signup({ ...body, role: "farmer" });
  assert.ok(token);
  assert.equal(created.role, "admin");
  assert.equal(created.email, "new@x.com");
  assert.equal(created.isVerified, true);
});

test("repeated signups are rate limited", async () => {
  fresh();
  for (let i = 0; i < 10; i++) await signup(body);
  await assert.rejects(signup(body), /Too many/);
});

test("existing email tells the visitor to sign in", async () => {
  fresh();
  const { Prisma } = await import("@prisma/client");
  const original = prisma.user.create;
  prisma.user.create = async () => {
    throw new Prisma.PrismaClientKnownRequestError("dup", { code: "P2002", clientVersion: "x" });
  };
  try {
    await assert.rejects(signup(body), /Sign in instead/);
  } finally {
    prisma.user.create = original;
  }
});
