"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getToken } from "@/lib/api";
import { useReceipt } from "@/hooks/useOrders";
import { formatXAF } from "@/lib/currency";
import { Button } from "@/components/ui/button";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" });
}

export function ReceiptView({ orderId }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => setIsLoggedIn(!!getToken()), []);

  const { data: order, isLoading, isError, error } = useReceipt(orderId, { enabled: isLoggedIn });

  if (!isLoggedIn) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <p className="text-muted-foreground">Log in to view this receipt.</p>
        <Link href="/login" className="mt-4 rounded-full bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white">Log In</Link>
      </main>
    );
  }

  if (isLoading) {
    return <main className="mx-auto max-w-2xl px-6 py-16 text-center text-sm text-muted-foreground">Loading receipt…</main>;
  }

  if (isError) {
    return <main className="mx-auto max-w-2xl px-6 py-16 text-center text-sm text-destructive">{error.message}</main>;
  }

  const paidSoFar = order.payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link href="/logbook" className="text-sm text-brand-blue underline">← Back to Logbook</Link>
        <Button onClick={() => window.print()} className="bg-brand-navy text-white hover:bg-brand-navy/90">
          Print
        </Button>
      </div>

      <div className="rounded-2xl border border-border p-8">
        <div className="flex items-start justify-between border-b border-border pb-6">
          <div>
            <p className="text-lg font-bold text-brand-navy-dark">Nkem Aeronautics Ltd</p>
            <p className="text-sm text-muted-foreground">Official Receipt</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-mono font-semibold text-brand-navy-dark">{order.receipt.receiptNumber}</p>
            <p className="text-muted-foreground">{formatDate(order.receipt.issuedAt)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-b border-border py-6 text-sm">
          <div>
            <p className="text-xs uppercase text-muted-foreground">Customer</p>
            <p className="text-brand-navy-dark">{order.user?.name ? `${order.user.name} ${order.user.surname ?? ""}` : order.user?.email}</p>
            <p className="text-muted-foreground">{order.user?.email}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase text-muted-foreground">Order</p>
            <p className="text-brand-navy-dark">{order.channel === "on_site" ? "On-site purchase" : "Online order"}</p>
            <p className="text-muted-foreground">{formatDate(order.createdAt)}</p>
          </div>
        </div>

        <table className="w-full border-b border-border py-2 text-left text-sm">
          <thead>
            <tr className="text-xs uppercase text-muted-foreground">
              <th className="py-3">Item</th>
              <th className="py-3 text-center">Qty</th>
              <th className="py-3 text-right">Unit Price</th>
              <th className="py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-t border-border">
                <td className="py-3 text-brand-navy-dark">{item.productName}</td>
                <td className="py-3 text-center text-muted-foreground">{item.quantity}</td>
                <td className="py-3 text-right text-muted-foreground">{formatXAF(item.unitPrice)}</td>
                <td className="py-3 text-right text-brand-navy-dark">{formatXAF(item.unitPrice * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ml-auto max-w-xs space-y-1 py-6 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-semibold text-brand-navy-dark">{formatXAF(order.totalAmount)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Paid</span><span className="text-brand-navy-dark">{formatXAF(paidSoFar)}</span></div>
        </div>

        {order.payments.length > 0 && (
          <div className="border-t border-border pt-4 text-xs text-muted-foreground">
            <p className="mb-1 font-medium uppercase">Payments</p>
            {order.payments.map((p) => (
              <p key={p.id}>{formatDate(p.createdAt)} — {p.method.replace("_", " ")} — {formatXAF(p.amount)}{p.reference ? ` (ref: ${p.reference})` : ""}</p>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
