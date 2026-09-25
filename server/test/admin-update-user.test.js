import { test } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/config/prisma.js";
import { updateUser } from "../src/modules/admin/admin.service.js";

// In-memory stand-in for the transaction client — never touches the real DB.
function useUsers(users) {
  prisma.$transaction = async (fn) =>
    fn({
      user: {
        findUnique: async ({ where }) => users.find((u) => u.id === where.id) ?? null,
        count: async ({ where }) =>
          users.filter((u) => u.role === where.role && u.isVerified === where.isVerified && u.id !== where.id.not).length,
        update: async ({ where, data }) => Object.assign(users.find((u) => u.id === where.id), data),
      },
    });
}

const admin = (id) => ({ id, role: "admin", isVerified: true, email: `${id}@x` });

test("admin cannot demote themselves", async () => {
  useUsers([admin("a"), admin("b")]);
  await assert.rejects(updateUser("a", { role: "customer" }, { id: "a" }), /your own admin access/);
});

test("admin cannot unverify themselves", async () => {
  useUsers([admin("a"), admin("b")]);
  await assert.rejects(updateUser("a", { isVerified: false }, { id: "a" }), /your own admin access/);
});

test("the last remaining admin cannot be removed", async () => {
  useUsers([admin("a"), { id: "c", role: "customer", isVerified: true }]);
  // actor "c" isn't really an admin here; the point is the zero-admin floor holds regardless.
  await assert.rejects(updateUser("a", { role: "customer" }, { id: "c" }), /At least one admin/);
});

test("demoting another admin works when one remains", async () => {
  useUsers([admin("a"), admin("b")]);
  const user = await updateUser("b", { role: "customer" }, { id: "a" });
  assert.equal(user.role, "customer");
});

test("ordinary role changes are unaffected", async () => {
  useUsers([admin("a"), { id: "f", role: "farmer", isVerified: true }]);
  const user = await updateUser("f", { role: "pilot" }, { id: "a" });
  assert.equal(user.role, "pilot");
});
