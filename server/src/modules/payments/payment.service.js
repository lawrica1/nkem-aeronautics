import crypto from "node:crypto";
import { prisma } from "../../config/prisma.js";
import { env } from "../../config/env.js";
import { HttpError } from "../../shared/errors/HttpError.js";
import { ORDER_STATUS } from "../orders/order.constants.js";
import { recordPayment } from "../orders/order.service.js";
import { initiateCheckout, verifyTransaction, isWebhookSignatureValid } from "./flutterwave.service.js";

export async function startCheckout(orderId, user) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== user.id) throw new HttpError(404, "Order not found.");
  if (order.status !== ORDER_STATUS.PENDING_PAYMENT) {
    throw new HttpError(400, "This order is not awaiting payment.");
  }

  const txRef = `NKEM-${orderId}-${crypto.randomUUID().slice(0, 8)}`;
  const attempt = await prisma.paymentAttempt.create({
    data: { orderId, txRef, amount: order.totalAmount },
  });

  const checkoutUrl = await initiateCheckout({
    txRef,
    amount: order.totalAmount,
    email: user.email,
    name: user.name || user.email,
    redirectUrl: `${env.clientOrigin}/orders/${orderId}/payment-callback`,
  });

  await prisma.paymentAttempt.update({ where: { id: attempt.id }, data: { checkoutUrl } });
  return { checkoutUrl };
}

// Single confirmation path for BOTH the browser redirect and the webhook — whichever
// arrives first wins the atomic claim below; the other becomes a no-op. Amount and
// currency are re-checked against Flutterwave's own verify response, never trusted
// from a redirect query string or webhook payload.
export async function confirmByTransactionId(transactionId) {
  const verified = await verifyTransaction(transactionId);

  const attempt = await prisma.paymentAttempt.findUnique({ where: { txRef: verified.tx_ref } });
  if (!attempt) throw new HttpError(404, "No matching payment attempt found for this transaction.");
  if (attempt.status === "successful") return { ok: true, orderId: attempt.orderId, alreadyProcessed: true };

  if (verified.status !== "successful") {
    await prisma.paymentAttempt.updateMany({
      where: { id: attempt.id, status: "pending" },
      data: { status: "failed", providerTxId: String(verified.id) },
    });
    return { ok: false, orderId: attempt.orderId, reason: verified.status };
  }

  if (verified.currency !== "XAF" || verified.amount < attempt.amount) {
    throw new HttpError(400, "The payment amount or currency does not match this order.");
  }

  // Atomic claim: only proceed if this attempt is still "pending". A duplicate webhook
  // (or a webhook racing the redirect) finds count === 0 here and stops — recordPayment
  // never runs twice for the same attempt.
  const claimed = await prisma.paymentAttempt.updateMany({
    where: { id: attempt.id, status: "pending" },
    data: { status: "successful", providerTxId: String(verified.id) },
  });
  if (claimed.count === 0) return { ok: true, orderId: attempt.orderId, alreadyProcessed: true };

  await recordPayment(attempt.orderId, {
    amount: verified.amount,
    method: verified.payment_type === "card" ? "card" : "mobile_money",
    reference: String(verified.id),
  });

  return { ok: true, orderId: attempt.orderId };
}

export { isWebhookSignatureValid };
