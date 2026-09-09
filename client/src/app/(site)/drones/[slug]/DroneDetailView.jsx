"use client";

import Link from "next/link";
import { useProductBySlug } from "@/hooks/useProducts";
import { APPLICATIONS } from "@/lib/applications";
import { ProductRow } from "@/components/portal/ProductRow";

export function DroneDetailView({ slug }) {
  const { data: product, isLoading, isError, error } = useProductBySlug(slug);

  if (isLoading) {
    return <main className="mx-auto max-w-4xl px-6 py-16 text-center text-sm text-muted-foreground">Loading platform…</main>;
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16 text-center">
        <p className="text-sm text-destructive">{error.message}</p>
        <Link href="/?sector=evtol#catalog" className="mt-4 inline-block text-sm text-brand-blue underline">← Back to catalogue</Link>
      </main>
    );
  }

  const applications = APPLICATIONS.filter((a) => product.applications?.includes(a.id));

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link href="/?sector=evtol#catalog" className="text-sm text-brand-blue underline">← Back to catalogue</Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-xl border border-border bg-brand-gray-light">
            {product.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.images[0]} alt={product.name} className="aspect-square w-full object-contain p-8" />
            ) : (
              <div className="flex aspect-square w-full items-center justify-center text-sm text-muted-foreground">
                Image coming soon
              </div>
            )}
          </div>

          {product.featureBadges?.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {product.featureBadges.map((badge) => (
                <div key={badge} className="rounded-lg bg-brand-input px-4 py-3 text-center text-sm font-medium text-brand-navy-dark">
                  {badge}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-brand-green">{product.type}</p>
          <h1 className="mt-1 text-2xl font-bold text-brand-navy-dark sm:text-3xl">{product.name}</h1>
          {product.description && <p className="mt-4 text-sm leading-6 text-muted-foreground">{product.description}</p>}

          <div className="mt-6 rounded-xl border border-border p-4">
            <ProductRow product={product} />
          </div>

          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mt-8">
              <h2 className="font-semibold text-brand-navy-dark">Specifications</h2>
              <dl className="mt-3 divide-y divide-border rounded-xl border border-border text-sm">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-4 px-4 py-2.5">
                    <dt className="text-muted-foreground">{key}</dt>
                    <dd className="font-medium text-brand-navy-dark">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {applications.length > 0 && (
            <div className="mt-8">
              <h2 className="font-semibold text-brand-navy-dark">Suited For</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {applications.map((a) => (
                  <span key={a.id} className="rounded-full bg-brand-green/10 px-3 py-1 text-xs font-medium text-brand-green">
                    {a.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
