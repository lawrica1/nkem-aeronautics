import Link from "next/link";
import { Pencil } from "lucide-react";

// Read-only admin view of one record. fields/specs: [[label, value]].
export function DetailCard({ title, status, editHref, fields, specs, images = [] }) {
  return (
    <div className="mt-4 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-brand-navy-dark">{title}</h1>
          {status}
        </div>
        <Link
          href={editHref}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-navy px-4 py-2 text-sm font-medium text-white hover:bg-brand-navy/90"
        >
          <Pencil className="size-4" /> Edit
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <dl className="grid gap-4 sm:grid-cols-2">
          {fields.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-semibold text-muted-foreground">{label}</dt>
              <dd className="mt-0.5 whitespace-pre-line text-sm text-brand-navy-dark">{value || "—"}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-brand-navy-dark">Specs</h2>
        {specs.length ? (
          <dl className="mt-3 divide-y divide-border text-sm">
            {specs.map(([label, value], i) => (
              <div key={i} className="flex justify-between gap-4 py-2">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="text-right font-medium text-brand-navy-dark">{String(value ?? "")}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">No specs recorded.</p>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-brand-navy-dark">Pictures</h2>
        {images.length ? (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images.map((url) => (
              <a key={url} href={url} target="_blank" rel="noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={title} className="aspect-square w-full rounded-lg object-cover" />
              </a>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">No pictures.</p>
        )}
      </div>
    </div>
  );
}
