"use client";

import { useEffect, useState } from "react";
import { useAdminUsers, useUpdateAdminUser } from "@/hooks/useAdminUsers";
import { useOrganizations } from "@/hooks/useOrganizations";
import { ROLE_OPTIONS, SECTOR_OPTIONS, COUNTRY_OPTIONS } from "@/lib/adminOptions";
import { getAdminToken } from "@/lib/api";

// UI hint only — the server enforces the real rule.
function currentAdminId() {
  try {
    const payload = getAdminToken()?.split(".")[1];
    return payload ? JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))).sub : null;
  } catch {
    return null;
  }
}

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
  const [myId, setMyId] = useState(null);
  useEffect(() => setMyId(currentAdminId()), []);

  function changeRole(user, nextRole) {
    const label = ROLE_OPTIONS.find((r) => r.value === nextRole)?.label ?? nextRole;
    if (!window.confirm(`Change ${user.email}'s role to ${label}?`)) return;
    update.mutate({ id: user.id, role: nextRole });
  }

  function revokeSessions(user) {
    if (!window.confirm(`Sign ${user.email} out on every device? They'll need to sign in again.`)) return;
    update.mutate({ id: user.id, revokeSessions: true });
  }

  function toggleVerified(user) {
    const action = user.isVerified ? "Unverify (this blocks their sign-in)" : "Verify";
    if (!window.confirm(`${action} ${user.email}?`)) return;
    update.mutate({ id: user.id, isVerified: !user.isVerified });
  }

  function toggleLogbookVerified(user) {
    const approved = !!user.logbookVerifiedAt;
    const label = user.name ? `${user.name} ${user.surname ?? ""}`.trim() : user.email;
    const action = approved ? "Revoke logbook verification for" : "Approve the logbook of";
    if (!window.confirm(`${action} ${label}?`)) return;
    update.mutate({ id: user.id, logbookVerified: !approved });
  }

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

      {update.isError && <p className="text-sm text-destructive">{update.error.message}</p>}
      {isLoading && <p className="text-sm text-muted-foreground">Loading users…</p>}
      {isError && <p className="text-sm text-destructive">{error.message}</p>}

      {!isLoading && !isError && (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          {users?.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">No users match.</p>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-b border-border bg-slate-50 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Country</th>
                  <th className="px-4 py-3 font-medium">Sector</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Organization</th>
                  <th className="px-4 py-3 font-medium">Account</th>
                  <th className="px-4 py-3 font-medium">Logbook</th>
                  <th className="px-4 py-3 font-medium">Sessions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users?.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-brand-navy-dark">
                      {user.name ? `${user.name} ${user.surname ?? ""}` : "—"}
                      {user.id === myId && <span className="ml-2 text-xs font-normal text-muted-foreground">(you)</span>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{user.country ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{user.sector ?? "—"}</td>
                    <td className="px-4 py-3">
                      <select
                        className={fieldClass}
                        value={user.role}
                        disabled={user.id === myId}
                        title={user.id === myId ? "You can't change your own role" : undefined}
                        onChange={(e) => changeRole(user, e.target.value)}
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
                        disabled={user.id === myId}
                        onClick={() => toggleVerified(user)}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.isVerified
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-gray-100 text-gray-500 border border-gray-200"
                        }`}
                      >
                        {user.isVerified ? "Verified" : "Unverified"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleLogbookVerified(user)}
                        title={user.logbookVerifiedAt ? `Approved ${new Date(user.logbookVerifiedAt).toLocaleDateString("en-GB")}` : "Click to approve"}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.logbookVerifiedAt
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {user.logbookVerifiedAt ? "Approved" : "Pending"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      {user.id !== myId && (
                        <button
                          type="button"
                          onClick={() => revokeSessions(user)}
                          className="text-xs font-medium text-muted-foreground hover:text-destructive hover:underline"
                        >
                          Sign out everywhere
                        </button>
                      )}
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
