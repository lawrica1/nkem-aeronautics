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

// Card with title, status filter, search and Add button on top, and a results count below.
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
            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
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
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
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
      <p className="border-t border-border px-6 py-4 text-sm text-muted-foreground">
        {count ? `Showing 1 to ${count} of ${count} results` : "No results"}
      </p>
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
