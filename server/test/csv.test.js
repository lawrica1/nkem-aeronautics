import { test } from "node:test";
import assert from "node:assert/strict";
import { escapeCell, toCsv } from "../src/shared/utils/csv.js";

test("formula payloads are neutralized with a leading apostrophe", () => {
  assert.equal(escapeCell("=1+1"), "'=1+1");
  assert.equal(escapeCell("@SUM(A1)"), "'@SUM(A1)");
  assert.equal(escapeCell("+cmd|' /C calc'!A0"), "'+cmd|' /C calc'!A0");
  assert.equal(escapeCell("-2+3+cmd|x"), "'-2+3+cmd|x");
  assert.equal(escapeCell("\t=1"), "'\t=1");
});

test("quoted payloads are neutralized and still valid CSV", () => {
  assert.equal(escapeCell('=HYPERLINK("http://evil","x")'), `"'=HYPERLINK(""http://evil"",""x"")"`);
});

test("phone numbers and negative numbers are left exactly as they are", () => {
  assert.equal(escapeCell("+237 670 000 000"), "+237 670 000 000");
  assert.equal(escapeCell("-12.5"), "-12.5");
  assert.equal(escapeCell("+1 (555) 010-0000"), "+1 (555) 010-0000");
});

test("ordinary values are unchanged", () => {
  assert.equal(escapeCell("Cocoa"), "Cocoa");
  assert.equal(escapeCell("Buea, Fako"), '"Buea, Fako"');
  assert.equal(escapeCell(null), "");
});

test("a whole row round-trips with the payload made inert", () => {
  const csv = toCsv([{ name: "=HYPERLINK(1)", tel: "+237 1" }], [{ key: "name", header: "Name" }, { key: "tel", header: "Tel" }]);
  assert.equal(csv, "Name,Tel\r\n'=HYPERLINK(1),+237 1");
});
