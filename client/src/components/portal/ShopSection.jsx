"use client";

import { ShoppingBag } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCreateOrder } from "@/hooks/useOrders";
import { ProductRow } from "@/components/portal/ProductRow";

export function ShopSection() {
  const { data: products, isLoading } = useProducts();
  const createOrder = useCreateOrder();

  return (
    <div>
      <h2 className="flex items-center gap-2 font-semibold text-brand-navy-dark">
        <ShoppingBag className="size-4 text-brand-green" />
        Drones & Parts
      </h2>

      {createOrder.isSuccess && (
        <p className="mt-2 rounded-lg bg-brand-green/10 px-3 py-2 text-xs text-brand-green">
          Order placed — we&rsquo;ll confirm payment details with you. Track it below.
        </p>
      )}
      {createOrder.isError && (
        <p className="mt-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{createOrder.error.message}</p>
      )}

      <div className="mt-4 overflow-hidden rounded-xl border border-border">
        {isLoading && <p className="px-4 py-10 text-center text-sm text-muted-foreground">Loading catalogue…</p>}
        {!isLoading && products?.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">No products listed yet.</p>
        )}
        {!isLoading && products?.length > 0 && (
          <div className="divide-y divide-border">
            {products.map((product) => <ProductRow key={product.id} product={product} />)}
          </div>
        )}
      </div>
    </div>
  );
}
