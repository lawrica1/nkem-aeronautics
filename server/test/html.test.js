import { test } from "node:test";
import assert from "node:assert/strict";
import { escapeHtml } from "../src/shared/utils/html.js";

test("markup in admin/pilot text renders as inert text", () => {
  assert.equal(
    escapeHtml(`<a href="http://evil">Refund</a><img src=x>`),
    "&lt;a href=&quot;http://evil&quot;&gt;Refund&lt;/a&gt;&lt;img src=x&gt;",
  );
  assert.equal(escapeHtml("Tom & Jerry's farm"), "Tom &amp; Jerry&#39;s farm");
});

test("empty values don't print 'undefined'", () => {
  assert.equal(escapeHtml(undefined), "");
  assert.equal(escapeHtml(null), "");
});
