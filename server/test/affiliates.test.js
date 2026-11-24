import { test } from "node:test";
import assert from "node:assert/strict";
import { Prisma } from "@prisma/client";
import { prisma } from "../src/config/prisma.js";
import { create, update, remove } from "../src/modules/affiliates/affiliate.service.js";

// In-memory counter and table — never touches the real DB.
let seq = 0;
prisma.counter.upsert = async () => ({ seq: ++seq });
prisma.affiliate.create = async ({ data }) => data;

const affiliate = (extra) => ({ name: " Mary Phiri ", email: " Mary@Example.com ", country: "zm", commissionRate: "7.5", ...extra });
const prismaError = (code) => new Prisma.PrismaClientKnownRequestError("x", { code, clientVersion: "x" });

test("referral codes carry the country and never repeat across countries", async () => {
  const a = await create(affiliate());
  const b = await create(affiliate({ country: "CM" }));
  assert.match(a.referralCode, /^NKEM-REF-ZM-\d{4}$/);
  assert.match(b.referralCode, /^NKEM-REF-CM-\d{4}$/);
  assert.notEqual(a.referralCode.slice(-4), b.referralCode.slice(-4));
  assert.equal(a.name, "Mary Phiri");
  assert.equal(a.email, "mary@example.com");
  assert.equal(a.commissionRate, 7.5);
});

test("create rejects missing name, bad email, bad country and out-of-range commission", async () => {
  await assert.rejects(create(affiliate({ name: "  " })), /name is required/);
  await assert.rejects(create(affiliate({ email: "not-an-email" })), /email/);
  await assert.rejects(create(affiliate({ country: "Zambia" })), /country/);
  await assert.rejects(create(affiliate({ commissionRate: 120 })), /commissionRate/);
});

test("status only accepts active or paused", async () => {
  await assert.rejects(update("x", { status: "banned" }), /status must be/);
});

test("duplicate email is a 409 and a missing affiliate is a 404", async () => {
  prisma.affiliate.create = async () => { throw prismaError("P2002"); };
  await assert.rejects(create(affiliate()), (err) => err.status === 409);
  prisma.affiliate.delete = async () => { throw prismaError("P2025"); };
  await assert.rejects(remove("missing"), (err) => err.status === 404);
});
