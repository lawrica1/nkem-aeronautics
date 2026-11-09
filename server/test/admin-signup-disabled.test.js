import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";

test("public admin signup is not exposed", async (t) => {
  const server = createApp().listen(0, "127.0.0.1");
  t.after(() => server.close());

  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/api/admin/signup`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "Attacker", email: "attacker@example.com", password: "password123" }),
  });

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { message: "Route not found." });
});
