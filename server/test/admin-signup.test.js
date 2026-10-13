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

test("signup is disabled when no code is configured", async () => {
  env.adminSignupCode = "";
  reset("admin-signup");
  await assert.rejects(signup({ ...body, code: "" }), /disabled/);
});

test("wrong code is rejected and creates nothing", async () => {
  env.adminSignupCode = "s3cret";
  reset("admin-signup");
  created = undefined;
  await assert.rejects(signup({ ...body, code: "wrong" }), /Invalid signup code/);
  assert.equal(created, undefined);
});

test("right code creates a verified admin and returns a token", async () => {
  env.adminSignupCode = "s3cret";
  reset("admin-signup");
  const { token } = await signup({ ...body, code: "s3cret", role: "farmer" });
  assert.ok(token);
  assert.equal(created.role, "admin");
  assert.equal(created.email, "new@x.com");
  assert.equal(created.isVerified, true);
});

test("repeated guesses are rate limited", async () => {
  env.adminSignupCode = "s3cret";
  reset("admin-signup");
  for (let i = 0; i < 10; i++) await assert.rejects(signup({ ...body, code: "wrong" }), /Invalid/);
  await assert.rejects(signup({ ...body, code: "s3cret" }), /Too many/);
});
