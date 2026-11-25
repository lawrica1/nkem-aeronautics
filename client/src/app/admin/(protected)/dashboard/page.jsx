"use client";

import Link from "next/link";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { StatusBadge } from "@/components/portal/StatusBadge";

const CARD = "rounded-2xl border border-border bg-white p-6 shadow-sm";

const ATTENTION = [
  { key: "pendingLogbooks", label: "Logbooks to verify", href: "/admin/logbook-verification" },
  { key: "newRequests", label: "New service requests", href: "/admin/requests" },
  { key: "awaitingPayment", label: "Orders awaiting payment", href: "/admin/orders" },
  { key: "newPartRequests", label: "New part requests", href: "/admin/part-requests" },
  { key: "newQuotes", label: "New quote requests", href: "/admin/quotes" },
];

const TOTALS = [
  { key: "verifiedUsers", label: "Verified users" },
  { key: "signupsThisWeek", label: "Sign-ups (last 7 days)" },
  { key: "totalRequests", label: "Service requests" },
  { key: "totalOrders", label: "Orders" },
];

const fullName = (p) => [p?.name, p?.surname].filter(Boolean).join(" ") || "—";
const date = (iso) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

function RecentList({ title, href, items, render }) {
  return (
    <div className={CARD}>
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-brand-navy-dark">{title}</h2>
        <Link href={href} className="text-sm font-medium text-brand-blue hover:underline">
          View all
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">Nothing yet.</p>
      ) : (
        <ul className="mt-3 divide-y divide-border text-sm">{items.map(render)}</ul>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error } = useAdminDashboard();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-brand-navy-dark">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">What needs attention today, and the latest activity.</p>

      {isLoading && <div className={`mt-8 text-sm text-muted-foreground ${CARD}`}>Loading…</div>}
      {isError && (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error.message}</div>
      )}

      {data && (
        <>
          <h2 className="mt-8 text-sm font-semibold text-slate-500">Needs attention</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {ATTENTION.map(({ key, label, href }) => {
              const count = data.attention[key];
              return (
                <Link
                  key={key}
                  href={href}
                  className={`${CARD} block transition-colors hover:border-brand-blue ${count ? "border-amber-300" : ""}`}
                >
                  <p className={`text-3xl font-bold tabular-nums ${count ? "text-amber-600" : "text-brand-navy-dark"}`}>
                    {count}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{label}</p>
                </Link>
              );
            })}
          </div>

          <h2 className="mt-8 text-sm font-semibold text-slate-500">Totals</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TOTALS.map(({ key, label }) => (
              <div key={key} className={CARD}>
                <p className="text-3xl font-bold tabular-nums text-brand-navy-dark">{data.totals[key]}</p>
                <p className="mt-1 text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <RecentList
              title="Latest service requests"
              href="/admin/requests"
              items={data.recentRequests}
              render={(r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-brand-navy-dark">{r.service}</p>
                    <p className="truncate text-muted-foreground">
                      {fullName(r.user)}
                      {r.region && ` · ${r.region}`} · {date(r.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </li>
              )}
            />
            <RecentList
              title="Latest registrations"
              href="/admin/users"
              items={data.recentUsers}
              render={(u) => (
                <li key={u.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-brand-navy-dark">{fullName(u)}</p>
                    <p className="truncate text-muted-foreground">
                      {u.identificationNumber || "No logbook yet"}
                      {u.region && ` · ${u.region}`}
                    </p>
                  </div>
                  <span className="shrink-0 text-muted-foreground">{date(u.createdAt)}</span>
                </li>
              )}
            />
          </div>
        </>
      )}
    </div>
  );
}
