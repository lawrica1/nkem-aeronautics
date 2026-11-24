"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAffiliates, useUpdateAffiliate, useDeleteAffiliate } from "@/hooks/useAffiliates";
import { TableCard, RowMenu, filterRows, pageRows, thClass, tdClass } from "@/components/admin/AdminTable";
import { COUNTRIES } from "@/lib/countries";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30";

export const STATUS_OPTIONS = [
  ["active", "Active"],
  ["paused", "Paused"],
];

const COUNTRY_NAMES = Object.fromEntries(COUNTRIES.map((c) => [c.code, c.name]));
export const countryName = (code) => COUNTRY_NAMES[code] ?? code;

export function AffiliateStatusPill({ status }) {
  const style = status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500";
  return <span className={`rounded-md px-2 py-0.5 text-xs font-medium uppercase ${style}`}>{status}</span>;
}

function toForm(a) {
  return {
    name: a?.name ?? "",
    company: a?.company ?? "",
    email: a?.email ?? "",
    phone: a?.phone ?? "",
    country: a?.country ?? "ZM",
    commissionRate: a ? String(Number(a.commissionRate)) : "0",
    notes: a?.notes ?? "",
  };
}

// The referral code is created when the affiliate is added and never changes after that.
export function AffiliateForm({ affiliate, mutation, submitLabel, onDone, onCancel }) {
  const [form, setForm] = useState(() => toForm(affiliate));
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const text = (key, label, props) => (
    <div className="space-y-1.5">
      <Label htmlFor={`aff-${key}`}>{label}</Label>
      <input id={`aff-${key}`} className={fieldClass} value={form[key]} onChange={set(key)} {...props} />
    </div>
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate(affiliate ? { id: affiliate.id, ...form } : form, { onSuccess: () => onDone?.() });
      }}
      className="grid gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm sm:grid-cols-2"
    >
      {text("name", "Full name", { required: true })}
      {text("company", "Company (optional)")}
      {text("email", "Email", { type: "email", required: true })}
      {text("phone", "Phone (optional)", { type: "tel" })}
      <div className="space-y-1.5">
        <Label htmlFor="aff-country">Country</Label>
        <select id="aff-country" className={fieldClass} value={form.country} onChange={set("country")}>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      {text("commissionRate", "Commission (%)", { type: "number", min: 0, max: 100, step: 0.01, required: true })}
      {!affiliate && (
        <p className="text-xs text-muted-foreground sm:col-span-2">
          A referral code is created automatically, e.g. NKEM-REF-ZM-0001.
        </p>
      )}
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="aff-notes">Notes</Label>
        <textarea id="aff-notes" rows={3} className={fieldClass} value={form.notes} onChange={set("notes")} />
      </div>

      {mutation.isError && <p className="text-sm text-destructive sm:col-span-2">{mutation.error.message}</p>}
      <div className="flex gap-2 sm:col-span-2">
        <Button type="submit" disabled={mutation.isPending} className="bg-brand-navy text-white hover:bg-brand-navy/90">
          {mutation.isPending ? "Saving…" : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

// Affiliates per country, most first. Clicking a country filters the table below.
function CountryCoverage({ affiliates, country, onCountry }) {
  const counts = {};
  for (const a of affiliates) counts[a.country] = (counts[a.country] ?? 0) + 1;
  const rows = Object.entries(counts).sort((x, y) => y[1] - x[1] || countryName(x[0]).localeCompare(countryName(y[0])));
  const chip = (active) =>
    `rounded-lg border px-3 py-1.5 text-sm font-medium ${
      active ? "border-brand-navy bg-brand-navy text-white" : "border-border text-brand-navy-dark hover:bg-slate-50"
    }`;

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-brand-navy-dark">Countries</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {affiliates.length} affiliate{affiliates.length === 1 ? "" : "s"} in {rows.length} of {COUNTRIES.length} countries
      </p>
      {rows.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by country">
          <button type="button" aria-pressed={!country} onClick={() => onCountry("")} className={chip(!country)}>
            All countries
          </button>
          {rows.map(([code, count]) => (
            <button key={code} type="button" aria-pressed={country === code} onClick={() => onCountry(code)} className={chip(country === code)}>
              {countryName(code)} · {count}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function AffiliatesView() {
  const { data: affiliates, isLoading, isError, error } = useAffiliates();
  const updateAffiliate = useUpdateAffiliate();
  const deleteAffiliate = useDeleteAffiliate();
  const router = useRouter();
  const [filters, setFilters] = useState({ status: "all", search: "", page: 1 });
  const [country, setCountry] = useState("");
  const rows = filterRows(affiliates, filters, ["name", "company", "email", "referralCode"]).filter(
    (a) => !country || a.country === country
  );

  return (
    <div className="space-y-6">
      {affiliates && (
        <CountryCoverage
          affiliates={affiliates}
          country={country}
          onCountry={(code) => {
            setCountry(code);
            setFilters({ ...filters, page: 1 });
          }}
        />
      )}
      <TableCard
        title={country ? `Affiliates in ${countryName(country)}` : "Affiliates"}
        filters={filters}
        onFiltersChange={setFilters}
        addHref="/admin/affiliates/new"
        addLabel="Add affiliate"
        count={rows.length}
        statusOptions={STATUS_OPTIONS}
      >
        {isLoading && <p className="px-6 py-10 text-center text-sm text-muted-foreground">Loading affiliates…</p>}
        {isError && <p className="px-6 py-10 text-center text-sm text-destructive">{error.message}</p>}
        {updateAffiliate.isError && <p className="px-6 py-2 text-sm text-destructive">{updateAffiliate.error.message}</p>}
        {deleteAffiliate.isError && <p className="px-6 py-2 text-sm text-destructive">{deleteAffiliate.error.message}</p>}

        {!isLoading && !isError && rows.length > 0 && (
          <table className="w-full text-left text-sm">
            <thead className="border-y border-border bg-slate-50">
              <tr>
                <th className={thClass}>Referral code</th>
                <th className={thClass}>Name</th>
                <th className={thClass}>Company</th>
                <th className={thClass}>Email</th>
                <th className={thClass}>Country</th>
                <th className={thClass}>Commission</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pageRows(rows, filters.page).map((a) => (
                <tr key={a.id} className="transition-colors hover:bg-slate-50">
                  <td className={`${tdClass} font-mono text-xs text-muted-foreground`}>{a.referralCode}</td>
                  <td className={tdClass}>
                    <Link href={`/admin/affiliates/${a.id}`} className="font-medium text-brand-blue hover:underline">
                      {a.name}
                    </Link>
                  </td>
                  <td className={`${tdClass} text-muted-foreground`}>{a.company || "—"}</td>
                  <td className={`${tdClass} text-muted-foreground`}>{a.email}</td>
                  <td className={`${tdClass} text-muted-foreground`}>{countryName(a.country)}</td>
                  <td className={`${tdClass} text-muted-foreground`}>{Number(a.commissionRate)}%</td>
                  <td className={tdClass}>
                    <AffiliateStatusPill status={a.status} />
                  </td>
                  <td className={tdClass}>
                    <RowMenu
                      items={[
                        { label: "View / edit", onClick: () => router.push(`/admin/affiliates/${a.id}`) },
                        {
                          label: a.status === "active" ? "Pause" : "Activate",
                          onClick: () => updateAffiliate.mutate({ id: a.id, status: a.status === "active" ? "paused" : "active" }),
                        },
                        {
                          label: "Delete",
                          onClick: () =>
                            window.confirm(`Delete affiliate ${a.name} (${a.referralCode})? This can't be undone.`) &&
                            deleteAffiliate.mutate(a.id),
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>
    </div>
  );
}
