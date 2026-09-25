"use client";

import { useEffect, useState } from "react";
import { useAdminUsers, useUpdateAdminUser } from "@/hooks/useAdminUsers";

const TABS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "all", label: "All" },
];

const fieldClass =
  "rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30";

const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString("en-GB") : "—");

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm text-brand-navy-dark">{value || "—"}</dd>
    </div>
  );
}

export function LogbookVerificationView() {
  const [tab, setTab] = useState("pending");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  useEffect(() => {
    const id = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  const { data: users, isLoading, isError, error } = useAdminUsers({ logbook: tab, search });
  const update = useUpdateAdminUser();

  function setApproved(user, approve) {
    const name = `${user.name ?? ""} ${user.surname ?? ""}`.trim() || user.email;
    const action = approve ? "Approve the logbook of" : "Revoke logbook approval for";
    if (!window.confirm(`${action} ${name} (${user.identificationNumber})?`)) return;
    update.mutate({ id: user.id, logbookVerified: approve });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg bg-brand-gray-light p-1">
          {TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTab(t.value)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium ${
                tab === t.value ? "bg-white text-brand-navy-dark shadow-sm" : "text-muted-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <input
          className={`${fieldClass} min-w-[220px] flex-1`}
          placeholder="Search name, email, or Logbook ID…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {update.isError && <p className="text-sm text-destructive">{update.error.message}</p>}
      {isLoading && <p className="text-sm text-muted-foreground">Loading logbooks…</p>}
      {isError && <p className="text-sm text-destructive">{error.message}</p>}

      {!isLoading && !isError && users?.length === 0 && (
        <p className="rounded-2xl border border-dashed border-border bg-white px-4 py-12 text-center text-sm text-muted-foreground">
          {tab === "pending" ? "No logbooks are waiting for verification." : "No logbooks match."}
        </p>
      )}

      <ul className="space-y-3">
        {users?.map((user) => {
          const approved = !!user.logbookVerifiedAt;
          return (
            <li key={user.id} className="rounded-2xl border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs font-semibold text-brand-blue">{user.identificationNumber}</p>
                  <p className="mt-0.5 font-semibold text-brand-navy-dark">
                    {`${user.name ?? ""} ${user.surname ?? ""}`.trim() || "—"}
                  </p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                      approved
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-amber-200 bg-amber-50 text-amber-700"
                    }`}
                  >
                    {approved ? `Approved ${formatDate(user.logbookVerifiedAt)}` : "Pending"}
                  </span>
                  <button
                    type="button"
                    disabled={update.isPending}
                    onClick={() => setApproved(user, !approved)}
                    className={
                      approved
                        ? "text-xs font-medium text-muted-foreground hover:text-destructive hover:underline"
                        : "rounded-full bg-brand-blue px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-blue-dark disabled:opacity-50"
                    }
                  >
                    {approved ? "Revoke" : "Approve"}
                  </button>
                </div>
              </div>

              <dl className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-3 lg:grid-cols-4">
                <Detail label="Telephone" value={user.telephone} />
                <Detail label="Sex" value={user.sex} />
                <Detail label="Sector" value={user.sector} />
                <Detail label="Crop" value={user.otherCrop || user.crop} />
                <Detail label="Country" value={user.country} />
                <Detail label="Region / District" value={[user.region, user.district].filter(Boolean).join(", ")} />
                <Detail label="Address" value={user.address} />
                <Detail label="Affiliation" value={user.firmLabel || user.organizationName} />
                <Detail label="Registered" value={formatDate(user.createdAt)} />
                <Detail label="Account" value={user.isVerified ? "Phone verified" : "Phone not verified"} />
              </dl>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
