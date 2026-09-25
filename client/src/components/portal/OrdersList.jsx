"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { useMyOrders } from "@/hooks/useOrders";
import { useStartCheckout } from "@/hooks/usePayments";
import { formatXAF } from "@/lib/currency";
import { Button } from "@/components/ui/button";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function PayOnlineButton({ orderId }) {
  const startCheckout = useStartCheckout();

  return (
    <div>
      <Button
        size="sm"
        disabled={startCheckout.isPending}
        onClick={() =>
          startCheckout.mutate(orderId, {
            onSuccess: (data) => { window.location.href = data.checkoutUrl; },
          })
        }
        className="bg-brand-navy text-white hover:bg-brand-navy/90"
      >
        {startCheckout.isPending ? "Redirecting…" : "Pay Online"}
      </Button>
      {startCheckout.isError && <p className="mt-1 text-xs text-destructive">{startCheckout.error.message}</p>}
    </div>
  );
}

export function OrdersList() {
  const { data: orders, isLoading, isError } = useMyOrders();

  if (isLoading || isError || !orders?.length) return null;

  return (
    <div>
      <h2 className="flex items-center gap-2 font-semibold text-brand-navy-dark">
        <Package className="size-4 text-brand-green" />
        My Orders
      </h2>
      <div className="mt-4 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-input/50 text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Receipt</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 text-muted-foreground">
                  {order.items.map((i) => i.productName).join(", ")}
                </td>
                <td className="px-4 py-3 font-medium text-brand-navy-dark">{formatXAF(order.totalAmount)}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(order.createdAt)}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-brand-input px-2.5 py-0.5 text-xs font-medium text-brand-navy-dark">
                    {order.statusLabel}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {order.receipt ? (
                    <Link href={`/receipts/${order.id}`} className="text-brand-blue underline">
                      View
                    </Link>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  {order.status === "pending_payment" && order.channel === "online" && (
                    <PayOnlineButton orderId={order.id} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
