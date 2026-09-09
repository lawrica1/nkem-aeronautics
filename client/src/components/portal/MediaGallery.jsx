"use client";

import { Images } from "lucide-react";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function MediaGallery({ requests }) {
  const items = (requests ?? [])
    .filter((r) => r.operation?.files?.length)
    .flatMap((r) => r.operation.files.map((file) => ({ ...file, service: r.service, date: r.operation.scheduledAt || r.createdAt })));

  if (items.length === 0) return null;

  return (
    <div>
      <h2 className="flex items-center gap-2 font-semibold text-brand-navy-dark">
        <Images className="size-4 text-brand-green" />
        Operational Footage & Photos
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item) => {
          const isImage = item.mimeType?.startsWith("image/");
          return (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="group overflow-hidden rounded-xl border border-border bg-background"
            >
              {isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt={item.originalName} className="aspect-square w-full object-cover transition-transform group-hover:scale-105" />
              ) : (
                <video src={item.url} className="aspect-square w-full object-cover" muted />
              )}
              <div className="p-2">
                <p className="truncate text-xs font-medium text-brand-navy-dark">{item.service}</p>
                <p className="text-[11px] text-muted-foreground">{formatDate(item.date)}</p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
