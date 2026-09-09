"use client";

import { useState } from "react";
import { usePartners, useCreatePartner } from "@/hooks/usePartners";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30";

const EMPTY_FORM = { name: "", email: "", telephone: "", password: "" };

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function PartnersAdminView() {
  const { data: partners, isLoading, isError, error } = usePartners();
  const createPartner = useCreatePartner();
  const [form, setForm] = useState(EMPTY_FORM);

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPartner.mutate(form, { onSuccess: () => setForm(EMPTY_FORM) });
        }}
        className="grid gap-4 rounded-xl border border-border p-4 sm:grid-cols-2"
      >
        <div className="space-y-1.5">
          <Label>Partner name</Label>
          <input className={fieldClass} required placeholder="e.g. SOWEDA" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Telephone</Label>
          <input className={fieldClass} value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Login email</Label>
          <input type="email" required className={fieldClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Password</Label>
          <input type="password" required className={fieldClass} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <p className="text-xs text-muted-foreground sm:col-span-2">
          The partner signs in at <span className="font-mono">/login</span> with these credentials and lands on their own portal.
        </p>
        {createPartner.isError && <p className="text-sm text-destructive sm:col-span-2">{createPartner.error.message}</p>}
        <Button type="submit" disabled={createPartner.isPending} className="bg-brand-navy text-white hover:bg-brand-navy/90 sm:col-span-2 sm:w-fit">
          {createPartner.isPending ? "Creating…" : "Create partner account"}
        </Button>
      </form>

      {isLoading && <p className="text-sm text-muted-foreground">Loading partners…</p>}
      {isError && <p className="text-sm text-destructive">{error.message}</p>}

      {!isLoading && !isError && (
        <div className="overflow-hidden rounded-xl border border-border">
          {partners?.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">No partner accounts yet — create one above.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-input/50 text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Telephone</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {partners?.map((partner) => (
                  <tr key={partner.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-brand-navy-dark">{partner.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{partner.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{partner.telephone || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(partner.createdAt)}</td>
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
