import { test } from "node:test";
import assert from "node:assert/strict";
import { originPattern } from "../src/app.js";

test("plain origins pass through unchanged", () => {
  assert.equal(originPattern("https://nkemaeronautics.com"), "https://nkemaeronautics.com");
});

test("a * matches one host label of a Vercel preview, nothing more", () => {
  const re = originPattern("https://nkem-web-*-favournarcisses-projects.vercel.app");
  assert.ok(re.test("https://nkem-web-a1b2c3d4e-favournarcisses-projects.vercel.app"));
  assert.ok(re.test("https://nkem-web-git-claude-funny-bell-fph5vm-favournarcisses-projects.vercel.app"));
  assert.ok(!re.test("https://nkem-web-x-favournarcisses-projects.vercel.app.evil.com"));
  assert.ok(!re.test("https://evil.com/nkem-web-x-favournarcisses-projects.vercel.app"));
  assert.ok(!re.test("https://nkem-web-a.b-favournarcisses-projects.vercel.app"));
  assert.ok(!re.test("http://nkem-web-x-favournarcisses-projects.vercel.app"));
});
