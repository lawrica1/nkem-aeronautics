"use client";

import { useState } from "react";
import { useOrganizations, useCreateOrganization, useUpdateOrganization } from "@/hooks/useOrganizations";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30";

const EMPTY_FORM = { name: "", type: "private", sector: "", contactName: "", contactPhone: "" };

export function OrganizationsAdminView() {
  const { data: organizations, isLoading, isError, error } = useOrganizations();
  const createOrg = useCreateOrganization();
  const updateOrg = useUpdateOrganization();
  const [form, setForm] = useState(EMPTY_FORM);

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createOrg.mutate(form, { onSuccess: () => setForm(EMPTY_FORM) });
        }}
        className="grid gap-4 rounded-xl border border-border p-4 sm:grid-cols-2"
      >
        <div className="space-y-1.5">
          <Label>Name</Label>
          <input className={fieldClass} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Type</Label>
          <select className={fieldClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="private">Private</option>
            <option value="government">Government</option>
            <option value="ngo">NGO / Conservation</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Contact name</Label>
          <input className={fieldClass} value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Contact phone</Label>
          <input className={fieldClass} value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
        </div>
        {createOrg.isError && <p className="text-sm text-destructive sm:col-span-2">{createOrg.error.message}</p>}
        <Button type="submit" disabled={createOrg.isPending} className="bg-brand-navy text-white hover:bg-brand-navy/90 sm:col-span-2 sm:w-fit">
          {createOrg.isPending ? "Adding…" : "Add organization"}
        </Button>
      </form>

      {isLoading && <p className="text-sm text-muted-foreground">Loading organizations…</p>}
      {isError && <p className="text-sm text-destructive">{error.message}</p>}

      {!isLoading && !isError && (
        <div className="overflow-hidden rounded-xl border border-border">
          {organizations?.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">No organizations yet — add one above.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-input/50 text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {organizations?.map((org) => (
                  <tr key={org.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-brand-navy-dark">{org.name}</td>
                    <td className="px-4 py-3 capitalize text-muted-foreground">{org.type}</td>
                    <td className="px-4 py-3 text-muted-foreground">{org.contactName || org.contactPhone || "—"}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => updateOrg.mutate({ id: org.id, active: !org.active })}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          org.active
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-gray-100 text-gray-500 border border-gray-200"
                        }`}
                      >
                        {org.active ? "Active" : "Inactive"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
