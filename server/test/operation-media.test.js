import { test } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/config/prisma.js";
import { attachMedia } from "../src/modules/operations/operation.service.js";

const stub = (name, value) => Object.defineProperty(prisma, name, { configurable: true, value });

// Files: f-admin owned by the admin, f-farmer owned by a farmer. One operation, flown by pilot p1.
function setup() {
  const files = [
    { id: "f-admin", ownerId: "admin", operationId: null },
    { id: "f-farmer", ownerId: "farmer", operationId: null },
  ];
  stub("operation", { findUnique: async ({ where }) => (where.id === "op1" ? { id: "op1", pilotId: "p1" } : null) });
  stub("pilot", { findUnique: async ({ where }) => (where.userId === "pilot-user" ? { id: "p1" } : null) });
  stub("fileAsset", {
    updateMany: async ({ where, data }) => {
      const hits = files.filter((f) => where.id.in.includes(f.id) && f.ownerId === where.ownerId);
      hits.forEach((f) => Object.assign(f, data));
      return { count: hits.length };
    },
  });
  return files;
}

test("a farmer can no longer attach media to an operation", async () => {
  setup();
  await assert.rejects(attachMedia("op1", { id: "farmer", role: "farmer" }, { fileAssetIds: ["f-farmer"] }), (e) => e.status === 403);
});

test("an admin cannot re-parent a file someone else uploaded", async () => {
  const files = setup();
  await assert.rejects(attachMedia("op1", { id: "admin", role: "admin" }, { fileAssetIds: ["f-farmer"] }), (e) => e.status === 400);
  assert.equal(files[1].operationId, null);
});

test("an admin attaching their own upload still works", async () => {
  const files = setup();
  await attachMedia("op1", { id: "admin", role: "admin" }, { fileAssetIds: ["f-admin"] }).catch((e) => {
    // serializeOperation needs a full operation row the stub doesn't model; the write is what we assert.
    if (e.status) throw e;
  });
  assert.equal(files[0].operationId, "op1");
});

test("a pilot not assigned to the operation is refused", async () => {
  setup();
  stub("pilot", { findUnique: async () => ({ id: "p2" }) });
  await assert.rejects(attachMedia("op1", { id: "other-pilot", role: "pilot" }, { fileAssetIds: ["f-admin"] }), (e) => e.status === 404);
});
