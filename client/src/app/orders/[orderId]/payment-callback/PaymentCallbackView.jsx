"use client";

import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useConfirmPayment } from "@/hooks/usePayments";

export function PaymentCallbackView({ orderId, transactionId, redirectStatus }) {
  const { data, isLoading, isError, error } = useConfirmPayment(
    redirectStatus === "cancelled" ? null : transactionId,
  );

  const failed = redirectStatus === "cancelled" || isError || (data && !data.ok);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-1 flex-col items-center justify-center px-6 text-center">
      {redirectStatus !== "cancelled" && isLoading && (
        <>
          <Loader2 className="size-10 animate-spin text-brand-blue" />
          <h1 className="mt-4 text-xl font-semibold text-brand-navy-dark">Confirming your payment…</h1>
          <p className="mt-1 text-sm text-muted-foreground">This only takes a moment.</p>
        </>
      )}

      {!isLoading && !failed && data?.ok && (
        <>
          <CheckCircle2 className="size-12 text-brand-green" />
          <h1 className="mt-4 text-xl font-semibold text-brand-navy-dark">Payment confirmed</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your receipt is ready.</p>
          <div className="mt-6 flex gap-3">
            <Link href={`/receipts/${orderId}`} className="rounded-full bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white">
              View Receipt
            </Link>
            <Link href="/logbook" className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-brand-navy-dark">
              Back to Logbook
            </Link>
          </div>
        </>
      )}

      {!isLoading && failed && (
        <>
          <XCircle className="size-12 text-destructive" />
          <h1 className="mt-4 text-xl font-semibold text-brand-navy-dark">Payment not completed</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {redirectStatus === "cancelled"
              ? "You cancelled the payment."
              : error?.message || data?.reason || "The payment could not be confirmed. No charge should have been made."}
          </p>
          <Link href="/logbook" className="mt-6 rounded-full bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white">
            Back to Logbook
          </Link>
        </>
      )}
    </main>
  );
}
