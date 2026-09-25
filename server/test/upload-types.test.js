import { test } from "node:test";
import assert from "node:assert/strict";
import { ALLOWED_UPLOAD_TYPES, IMAGE_TYPES } from "../src/modules/storage/upload.middleware.js";

test("script-capable types are not uploadable", () => {
  for (const type of ["image/svg+xml", "text/html", "application/xhtml+xml", "text/xml", "image/x-anything"]) {
    assert.equal(ALLOWED_UPLOAD_TYPES.includes(type), false, type);
  }
  assert.equal(IMAGE_TYPES.includes("image/svg+xml"), false);
});

test("the photo and video formats phones produce are still accepted", () => {
  for (const type of ["image/jpeg", "image/png", "image/heic", "video/mp4", "video/quicktime", "video/3gpp", "application/pdf"]) {
    assert.equal(ALLOWED_UPLOAD_TYPES.includes(type), true, type);
  }
});
