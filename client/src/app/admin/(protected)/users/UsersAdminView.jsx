"use client";

import { useEffect, useState } from "react";
import { useAdminUsers, useUpdateAdminUser } from "@/hooks/useAdminUsers";
import { useOrganizations } from "@/hooks/useOrganizations";
import { ROLE_OPTIONS, SECTOR_OPTIONS, COUNTRY_OPTIONS } from "@/lib/adminOptions";

const fieldClass =
  "rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30";

function useDebounced(value, delayMs) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

export function UsersAdminView() {
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounced(searchInput, 300);
  const [role, setRole] = useState("");
  const [sector, setSector] = useState("");
  const [country, setCountry] = useState("");

  const { data: users, isLoading, isError, error } = useAdminUsers({ search, role, sector, country });
  const { data: organizations } = useOrganizations();
  const update = useUpdateAdminUser();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <input
          className={`${fieldClass} flex-1 min-w-[200px]`}
          placeholder="Search name, email, or Logbook ID…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <select className={fieldClass} value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All roles</option>
          {ROLE_OPTIONS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        <select className={fieldClass} value={sector} onChange={(e) => setSector(e.target.value)}>
          <option value="">All sectors</option>
          {SECTOR_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <select className={fieldClass} value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">All countries</option>
          {COUNTRY_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading users…</p>}
      {isError && <p className="text-sm text-destructive">{error.message}</p>}

      {!isLoading && !isError && (
        <div className="overflow-hidden rounded-xl border border-border">
          {users?.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">No users match.</p>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-brand-input/50 text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Country</th>
                  <th className="px-4 py-3 font-medium">Sector</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Organization</th>
                  <th className="px-4 py-3 font-medium">Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users?.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-brand-navy-dark">
                      {user.name ? `${user.name} ${user.surname ?? ""}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{user.country ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{user.sector ?? "—"}</td>
                    <td className="px-4 py-3">
                      <select
                        className={fieldClass}
                        value={user.role}
                        onChange={(e) => update.mutate({ id: user.id, role: e.target.value })}
                      >
                        {ROLE_OPTIONS.map((r) => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className={fieldClass}
                        value={user.organizationId ?? ""}
                        onChange={(e) => update.mutate({ id: user.id, organizationId: e.target.value || null })}
                      >
                        <option value="">None</option>
                        {organizations?.map((org) => (
                          <option key={org.id} value={org.id}>{org.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => update.mutate({ id: user.id, isVerified: !user.isVerified })}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.isVerified
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-gray-100 text-gray-500 border border-gray-200"
                        }`}
                      >
                        {user.isVerified ? "Verified" : "Unverified"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
