import { test } from "node:test";
import assert from "node:assert/strict";
import { Prisma } from "@prisma/client";
import { prisma } from "../src/config/prisma.js";
import { create, update } from "../src/modules/products/product.service.js";

// In-memory stubs — never touches the real DB.
prisma.product.findUnique = async () => null;
prisma.product.create = async ({ data }) => data;
prisma.product.update = async ({ data }) => data;

test("clearing At a glance / specs / headline figures saves a database NULL, not a 500", async () => {
  const created = await create({ name: "NKM-S", sector: "wildlife", compare: null, specs: null, keyFigures: null });
  assert.equal(created.compare, Prisma.DbNull);
  assert.equal(created.specs, Prisma.DbNull);
  assert.equal(created.keyFigures, Prisma.DbNull);
  const updated = await update("p1", { compare: { "Flight time": "45 min" } });
  assert.deepEqual(updated.compare, { "Flight time": "45 min" });
});
