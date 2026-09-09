import { env, requireEnv } from "../../config/env.js";

const BASE_URL = "https://api.flutterwave.com/v3";

function authHeaders() {
  return {
    Authorization: `Bearer ${requireEnv("FLUTTERWAVE_SECRET_KEY", env.flutterwaveSecretKey)}`,
    "Content-Type": "application/json",
  };
}

// Standard Checkout — returns a hosted payment page URL the customer is redirected to.
// Docs: https://developer.flutterwave.com/docs/collecting-payments/standard
export async function initiateCheckout({ txRef, amount, currency = "XAF", email, name, redirectUrl }) {
  const response = await fetch(`${BASE_URL}/payments`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      tx_ref: txRef,
      amount,
      currency,
      redirect_url: redirectUrl,
      customer: { email, name },
      customizations: { title: "Nkem Aeronautics" },
    }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || data?.status !== "success" || !data.data?.link) {
    throw new Error(data?.message || `Flutterwave checkout request failed (${response.status}).`);
  }

  return data.data.link;
}

// Server-side verification — the ONLY source of truth for whether a payment actually
// succeeded. Never trust a redirect query string or a webhook body's own status/amount
// fields; both are re-checked against this call. Docs:
// https://developer.flutterwave.com/docs/collecting-payments/verify-transactions
export async function verifyTransaction(transactionId) {
  const response = await fetch(`${BASE_URL}/transactions/${transactionId}/verify`, {
    headers: authHeaders(),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || data?.status !== "success" || !data.data) {
    throw new Error(data?.message || `Flutterwave transaction verification failed (${response.status}).`);
  }

  return data.data;
}

// Flutterwave's webhook signature is a static shared secret you set once in the dashboard
// (Settings -> Webhooks) and mirror here — a plain string compare, not an HMAC over the body.
export function isWebhookSignatureValid(receivedHash) {
  return !!env.flutterwaveWebhookHash && receivedHash === env.flutterwaveWebhookHash;
}
