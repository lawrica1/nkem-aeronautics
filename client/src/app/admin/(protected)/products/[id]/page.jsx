"use client";

import { useParams, useRouter } from "next/navigation";
import { useAdminProducts } from "@/hooks/useProducts";
import { StatusPill } from "@/components/admin/AdminTable";
import { DetailCard } from "@/components/admin/DetailCard";
import { PRODUCT_SECTOR_OPTIONS } from "@/lib/adminOptions";
import { formatXAF } from "@/lib/currency";
import { specEntries } from "@/lib/catalog";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: products, isLoading, isError, error } = useAdminProducts();
  const product = products?.find((p) => p.id === id);

  return (
    <div>
      {/* Reached from both the Drones and Products pages, so go back to whichever it was. */}
      <button type="button" onClick={() => router.back()} className="text-sm text-brand-blue underline">
        ← Back
      </button>
      {isLoading && <p className="mt-8 text-sm text-muted-foreground">Loading product…</p>}
      {isError && <p className="mt-8 text-sm text-destructive">{error.message}</p>}
      {products && !product && <p className="mt-8 text-sm text-muted-foreground">Product not found.</p>}
      {product && (
        <DetailCard
          title={product.name}
          status={<StatusPill active={product.active} />}
          editHref={`/admin/products/${id}/edit`}
          fields={[
            ["Sector", PRODUCT_SECTOR_OPTIONS.find((s) => s.value === product.sector)?.label ?? product.sector],
            ["Type", product.type],
            ["Model", product.model],
            ["Price", formatXAF(product.price)],
            ["Availability", product.availability],
            ["Key spec", product.highlight],
            ["Tags", product.tags?.join(", ")],
            ...(product.sector === "agricultural"
              ? [["Crops", product.crops?.join(", ")], ["Service", product.service]]
              : []),
            ["Description", product.description],
          ]}
          specs={specEntries(product.specs)}
          images={product.images}
        />
      )}
    </div>
  );
}
