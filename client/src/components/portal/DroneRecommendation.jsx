"use client";

import { useState } from "react";
import { Compass } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { ProductRow } from "@/components/portal/ProductRow";

const PRESETS_BY_SECTOR = {
  wildlife: ["Thermal", "Long Range", "Tethered", "GPS"],
};

export function DroneRecommendation({ sector }) {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const { data: products, isLoading } = useProducts(sector, submittedQuery);
  const presets = PRESETS_BY_SECTOR[sector] ?? [];

  return (
    <div>
      <h2 className="flex items-center gap-2 font-semibold text-brand-navy-dark">
        <Compass className="size-4 text-brand-green" />
        Find the Right Drone
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Tell us what you need and we&rsquo;ll match it against our catalogue.
      </p>

      <form
        onSubmit={(e) => { e.preventDefault(); setSubmittedQuery(query); }}
        className="mt-3 flex flex-wrap gap-2"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. thermal camera, long range, mapping…"
          className="min-w-[220px] flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
        />
        <button type="submit" className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-medium text-white hover:bg-brand-navy/90">
          Find drones
        </button>
      </form>

      {presets.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => { setQuery(preset); setSubmittedQuery(preset); }}
              className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground hover:border-brand-blue/50 hover:text-brand-blue"
            >
              {preset}
            </button>
          ))}
        </div>
      )}

      {submittedQuery && (
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          {isLoading && <p className="px-4 py-8 text-center text-sm text-muted-foreground">Searching…</p>}
          {!isLoading && products?.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              No matches for &ldquo;{submittedQuery}&rdquo; yet — contact us and we&rsquo;ll help you find the right drone.
            </p>
          )}
          {!isLoading && products?.length > 0 && (
            <div className="divide-y divide-border">
              {products.map((product) => <ProductRow key={product.id} product={product} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
