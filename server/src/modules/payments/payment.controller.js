import * as paymentService from "./payment.service.js";

export async function startCheckout(req, res) {
  res.status(201).json(await paymentService.startCheckout(req.params.orderId, req.user));
}

export async function confirm(req, res) {
  const { transaction_id, status } = req.query;
  if (!transaction_id || status === "cancelled") {
    return res.json({ ok: false, reason: status || "missing_transaction_id" });
  }
  res.json(await paymentService.confirmByTransactionId(transaction_id));
}

export async function webhook(req, res) {
  const signature = req.get("verif-hash");
  if (!paymentService.isWebhookSignatureValid(signature)) {
    return res.status(401).json({ message: "Invalid signature." });
  }

  const transactionId = req.body?.data?.id;
  if (transactionId) {
    // Don't let a confirmation error surface as a webhook failure — Flutterwave would
    // just retry it. Log it; the customer's own redirect confirms the same transaction too.
    await paymentService.confirmByTransactionId(transactionId).catch((error) => {
      console.error(`[flutterwave webhook] confirm failed for transaction ${transactionId}:`, error.message);
    });
  }

  res.json({ status: "received" });
}
