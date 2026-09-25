import { test, before } from "node:test";
import assert from "node:assert/strict";
import { env } from "../src/config/env.js";
import { prisma } from "../src/config/prisma.js";
import { confirmByTransactionId } from "../src/modules/payments/payment.service.js";
import { isWebhookSignatureValid } from "../src/modules/payments/flutterwave.service.js";

before(() => {
  env.flutterwaveSecretKey = "test-key";
  // Flutterwave's verify endpoint, stubbed: transaction 42 is a successful payment for attempt tx-1.
  globalThis.fetch = async (url) => ({
    ok: true,
    json: async () =>
      url.endsWith("/transactions/42/verify")
        ? { status: "success", data: { tx_ref: "tx-1", status: "successful", currency: "XAF", amount: 1000, id: 42 } }
        : { status: "error" },
  });
  const stub = (name, value) => Object.defineProperty(prisma, name, { configurable: true, value });
  stub("paymentAttempt", { findUnique: async () => ({ id: "a1", orderId: "o1", status: "successful", amount: 1000 }) });
  stub("order", { findUnique: async () => ({ userId: "owner" }) });
});

test("confirming someone else's transaction looks like it doesn't exist", async () => {
  await assert.rejects(confirmByTransactionId("42", { id: "stranger" }), (e) => e.status === 404);
});

test("the order's owner can still confirm", async () => {
  const result = await confirmByTransactionId("42", { id: "owner" });
  assert.equal(result.orderId, "o1");
});

test("the webhook path (no user) still confirms", async () => {
  const result = await confirmByTransactionId("42");
  assert.equal(result.ok, true);
});

test("non-numeric transaction ids never reach the Flutterwave URL", async () => {
  await assert.rejects(confirmByTransactionId("1/../../balances", { id: "owner" }), (e) => e.status === 400);
});

test("webhook signature: right hash passes, wrong/missing/other-length fail", () => {
  env.flutterwaveWebhookHash = "s3cret-hash";
  assert.equal(isWebhookSignatureValid("s3cret-hash"), true);
  assert.equal(isWebhookSignatureValid("s3cret-hasX"), false);
  assert.equal(isWebhookSignatureValid("short"), false);
  assert.equal(isWebhookSignatureValid(undefined), false);
  env.flutterwaveWebhookHash = undefined;
  assert.equal(isWebhookSignatureValid("s3cret-hash"), false);
});
