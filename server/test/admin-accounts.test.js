import { test } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/config/prisma.js";
import { env } from "../src/config/env.js";
import { adminRouter } from "../src/modules/admin/admin.routes.js";
import { createAdmin } from "../src/modules/admin/admin.service.js";
import { requireUser } from "../src/shared/middleware/auth.js";

env.brevoApiKey = undefined;
env.smtpPass = undefined;

// Admin accounts are created only by an existing admin (or the create-admin script).
test("login is the only admin route reachable without a session", () => {
  const open = adminRouter.stack
    .filter((layer) => layer.route && layer.route.stack[0].handle !== requireUser)
    .map((layer) => layer.route.path);
  assert.deepEqual(open, ["/login"]);
});

test("a new admin has no password until they prove the email via forgot-password", async () => {
  let created;
  prisma.user.create = async ({ data }) => (created = { id: "u1", ...data });
  await createAdmin({ name: "New", email: "New@x.com", password: "chosen-by-creator" }, { id: "a1" });
  assert.equal(created.passwordHash, null);
  assert.equal(created.email, "new@x.com");
  assert.equal(created.role, "admin");
});
