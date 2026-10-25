"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { useMyOrders } from "@/hooks/useOrders";
import { formatXAF } from "@/lib/currency";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function OrdersList() {
  const { data: orders, isLoading, isError } = useMyOrders();

  if (isLoading) return null;
  if (isError) return (
    <p className="text-sm text-destructive">Could not load your orders. Please refresh to try again.</p>
  );
  if (!orders?.length) return null;

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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
