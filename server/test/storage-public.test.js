import { test } from "node:test";
import assert from "node:assert/strict";

process.env.STORAGE_BUCKET = "bucket";
process.env.AWS_ENDPOINT_URL_S3 = "https://store.example.com";
const { isPublicKey, storageKeyFromUrl, freshStorageUrl } = await import("../src/modules/storage/storage.service.js");
const { upload, publicFile } = await import("../src/modules/storage/storage.controller.js");

const KEY = "product-photos/2026-11-26/d626b81d-9e02-4003-b882-695c2f684a9f.jpeg";

test("only website photo keys are public", () => {
  assert.equal(isPublicKey(KEY), true);
  assert.equal(isPublicKey("news/2026-11-26/d626b81d-9e02-4003-b882-695c2f684a9f"), true);
  assert.equal(isPublicKey(KEY.replace("product-photos", "id-card-photos")), false);
  assert.equal(isPublicKey(KEY.replace("product-photos", "part-request")), false);
  assert.equal(isPublicKey(`${KEY}/../../secret`), false);
});

test("keys are recovered from expired signed links and s3 references, not other hosts", () => {
  assert.equal(storageKeyFromUrl(`https://store.example.com/bucket/${KEY}?X-Amz-Expires=900`), KEY);
  assert.equal(storageKeyFromUrl(`s3://bucket/${KEY}`), KEY);
  assert.equal(storageKeyFromUrl(`https://evil.example.com/bucket/${KEY}`), null);
  assert.equal(storageKeyFromUrl("/images/products/dji-t100.jpg"), null);
});

test("non-storage photo links pass through unchanged", async () => {
  assert.equal(await freshStorageUrl("https://cdn.example.com/a.jpg"), "https://cdn.example.com/a.jpg");
  assert.equal(await freshStorageUrl(null), null);
});

test("only admins can upload website photos, and only images", async () => {
  const req = (role, mimetype) => ({ body: { purpose: "product-photos" }, user: { id: "u", role }, file: { mimetype } });
  await assert.rejects(upload(req("customer", "image/png"), {}), (err) => err.status === 403);
  await assert.rejects(upload(req("admin", "application/pdf"), {}), (err) => err.status === 400);
});

test("private files are never served from the public address", async () => {
  const req = { params: [KEY.replace("product-photos", "id-card-photos")] };
  await assert.rejects(publicFile(req, {}), (err) => err.status === 404);
});
