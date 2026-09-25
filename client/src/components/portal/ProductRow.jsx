"use client";

import { useEffect, useState } from "react";
import { useCreateOrder } from "@/hooks/useOrders";
import { getToken } from "@/lib/api";
import { formatXAF } from "@/lib/currency";
import { Button } from "@/components/ui/button";

export function ProductRow({ product }) {
  const createOrder = useCreateOrder();
  const [quantity, setQuantity] = useState(1);
  // Synced after mount — localStorage isn't available during the server render.
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => setLoggedIn(!!getToken()), []);
  const hasPrice = product.price !== null;
  const canOrder = hasPrice && loggedIn;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
      <div>
        <p className="font-medium text-brand-navy-dark">{product.name}</p>
        <p className="text-xs text-muted-foreground">{[product.type, product.model].filter(Boolean).join(" · ") || product.sector}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-brand-navy-dark">{formatXAF(product.price)}</span>
        {canOrder ? (
          <>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-16 rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
            />
            <Button
              size="sm"
              disabled={createOrder.isPending}
              onClick={() => createOrder.mutate({ items: [{ productId: product.id, quantity: Number(quantity) || 1 }] })}
              className="bg-brand-navy text-white hover:bg-brand-navy/90"
            >
              {createOrder.isPending ? "Placing…" : "Order"}
            </Button>
          </>
        ) : (
          <span className="text-xs text-muted-foreground">{product.availability || "Contact us"}</span>
        )}
      </div>
    </div>
  );
}
