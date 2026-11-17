import { test } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/config/prisma.js";
import { create, update, remove } from "../src/modules/idCards/idCard.service.js";
import { Prisma } from "@prisma/client";

// In-memory counter and table — never touches the real DB.
let seq = 0;
prisma.counter.upsert = async () => ({ seq: ++seq });
prisma.idCard.create = async ({ data }) => data;

const card = (cardType) => ({
  fullName: " Jane Banda ",
  jobTitle: "Pilot",
  department: "Operations",
  country: "Zambia",
  cardType,
  issueDate: "2026-10-01",
  expiryDate: "2028-10-01",
});

test("employee IDs follow NKEM-<role>-<seq> and never repeat across roles", async () => {
  const a = await create(card("director"));
  const b = await create(card("employee"));
  assert.match(a.employeeId, /^NKEM-DIR-\d{4}$/);
  assert.match(b.employeeId, /^NKEM-EMP-\d{4}$/);
  assert.notEqual(a.employeeId.slice(-4), b.employeeId.slice(-4));
  assert.equal(a.fullName, "Jane Banda");
});

test("create rejects bad card type, missing fields and expiry before issue", async () => {
  await assert.rejects(create(card("manager")), /cardType/);
  await assert.rejects(create({ ...card("employee"), fullName: "  " }), /fullName is required/);
  await assert.rejects(create({ ...card("employee"), expiryDate: "2026-01-01" }), /after the issue date/);
});

test("status only accepts active, lost or returned", async () => {
  await assert.rejects(update("x", { status: "stolen" }), /status must be/);
});

test("photoUrl must be an http(s) URL", async () => {
  await assert.rejects(create({ ...card("employee"), photoUrl: "javascript:alert(1)" }), /photoUrl/);
  const ok = await create({ ...card("employee"), photoUrl: "https://cdn.example.com/a.jpg" });
  assert.equal(ok.photoUrl, "https://cdn.example.com/a.jpg");
});

test("deleting a missing card is a 404, not a crash", async () => {
  prisma.idCard.delete = async () => {
    throw new Prisma.PrismaClientKnownRequestError("not found", { code: "P2025", clientVersion: "x" });
  };
  await assert.rejects(remove("missing"), (err) => err.status === 404);
});
