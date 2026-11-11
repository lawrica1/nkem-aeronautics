import { test } from "node:test";
import assert from "node:assert/strict";
import { slugify } from "../src/modules/products/product.service.js";

test("product names become readable page addresses", () => {
  assert.equal(slugify("NKM-AGR-300 VTOL"), "nkm-agr-300-vtol");
  assert.equal(slugify("  DJI T100 Agricultural Drone (2026) "), "dji-t100-agricultural-drone-2026");
  assert.equal(slugify("Pulvérisateur 120 L"), "pulverisateur-120-l");
  assert.equal(slugify("***"), "product");
});
