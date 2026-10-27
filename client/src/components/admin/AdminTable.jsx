"use client";

import Link from "next/link";
import { Menu } from "@base-ui/react/menu";
import { MoreVertical, Plus } from "lucide-react";

const controlClass =
  "rounded-lg border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30";

// Filters rows by active status and a case-insensitive search over the given fields.
export function filterRows(rows, { status, search }, fields) {
  const q = search.trim().toLowerCase();
  return (rows ?? []).filter(
    (row) =>
      (status === "all" || row.active === (status === "active")) &&
      (!q || fields.some((f) => String(row[f] ?? "").toLowerCase().includes(q)))
  );
}

export const PAGE_SIZE = 8;

const pageCount = (count) => Math.max(1, Math.ceil(count / PAGE_SIZE));
// Clamped so a page that empties (e.g. after a filter change) falls back to the last one.
const clampPage = (page, count) => Math.min(Math.max(1, page ?? 1), pageCount(count));

export function pageRows(rows, page) {
  const start = (clampPage(page, rows.length) - 1) * PAGE_SIZE;
  return rows.slice(start, start + PAGE_SIZE);
}

// Page buttons with ellipses, e.g. 1 2 3 4 5 … 20 or 1 … 9 10 11 … 20.
export function pageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}

const pageBtn =
  "min-w-9 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-brand-navy-dark hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent";

// Card with title, status filter, search and Add button on top, and a results count with paging below.
export function TableCard({ title, filters, onFiltersChange, addHref, addLabel, count, children }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
        <h2 className="text-lg font-semibold text-brand-navy-dark">{title}</h2>
        <div className="flex flex-wrap items-center gap-3">
          <select
            aria-label="Filter by status"
            className={controlClass}
            value={filters.status}
            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value, page: 1 })}
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <input
            type="search"
            aria-label="Search"
            placeholder="Search..."
            className={`${controlClass} w-56`}
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value, page: 1 })}
          />
          <Link
            href={addHref}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-navy px-4 py-2 text-sm font-medium text-white hover:bg-brand-navy/90"
          >
            <Plus className="size-4" /> {addLabel}
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto">{children}</div>
      <Pager count={count} page={filters.page} onPage={(page) => onFiltersChange({ ...filters, page })} />
    </div>
  );
}

function Pager({ count, page, onPage }) {
  const total = pageCount(count);
  const current = clampPage(page, count);
  const first = (current - 1) * PAGE_SIZE + 1;
  const last = Math.min(current * PAGE_SIZE, count);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-4">
      <p className="text-sm text-muted-foreground">
        {count ? `Showing ${first} to ${last} of ${count} results` : "No results"}
      </p>
      {total > 1 && (
        <nav aria-label="Pagination" className="flex flex-wrap items-center gap-1.5">
          <button type="button" className={pageBtn} disabled={current === 1} onClick={() => onPage(current - 1)}>
            Previous
          </button>
          {pageList(current, total).map((p, i) =>
            p === "…" ? (
              <span key={`gap-${i}`} className="px-1.5 text-sm text-muted-foreground">…</span>
            ) : (
              <button
                key={p}
                type="button"
                aria-current={p === current ? "page" : undefined}
                onClick={() => onPage(p)}
                className={p === current ? `${pageBtn} border-brand-navy bg-brand-navy text-white hover:bg-brand-navy` : pageBtn}
              >
                {p}
              </button>
            )
          )}
          <button type="button" className={pageBtn} disabled={current === total} onClick={() => onPage(current + 1)}>
            Next
          </button>
        </nav>
      )}
    </div>
  );
}

export function StatusPill({ active }) {
  return (
    <span
      className={`rounded-md px-2 py-0.5 text-xs font-medium uppercase ${
        active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

// Kebab menu for a row. items: [{ label, onClick }]
export function RowMenu({ items }) {
  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label="Actions"
        className="rounded-md p-1.5 text-brand-navy-dark hover:bg-slate-100"
      >
        <MoreVertical className="size-4" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner align="end" sideOffset={4} className="z-50">
          <Menu.Popup className="min-w-36 rounded-lg border border-border bg-white py-1 text-sm shadow-lg outline-none">
            {items.map((item) => (
              <Menu.Item
                key={item.label}
                onClick={item.onClick}
                className="cursor-pointer px-3 py-2 text-brand-navy-dark outline-none data-[highlighted]:bg-slate-100"
              >
                {item.label}
              </Menu.Item>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

export const thClass = "px-6 py-3 text-xs font-semibold text-brand-navy-dark";
export const tdClass = "px-6 py-3.5";
