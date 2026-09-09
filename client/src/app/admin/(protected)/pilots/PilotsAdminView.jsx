"use client";

import { useState } from "react";
import { usePilots, useCreatePilot, useUpdatePilot } from "@/hooks/usePilotsAndDrones";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30";

export function PilotsAdminView() {
  const { data: pilots, isLoading, isError, error } = usePilots();
  const createPilot = useCreatePilot();
  const updatePilot = useUpdatePilot();
  const [form, setForm] = useState({ name: "", telephone: "", email: "", droneTypes: "", password: "" });
  const [grantLogin, setGrantLogin] = useState(false);

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const payload = grantLogin ? form : { ...form, password: undefined };
          createPilot.mutate(payload, {
            onSuccess: () => {
              setForm({ name: "", telephone: "", email: "", droneTypes: "", password: "" });
              setGrantLogin(false);
            },
          });
        }}
        className="grid gap-4 rounded-xl border border-border p-4 sm:grid-cols-2"
      >
        <div className="space-y-1.5">
          <Label>Name</Label>
          <input className={fieldClass} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Telephone</Label>
          <input className={fieldClass} value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Email</Label>
          <input type="email" className={fieldClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Drone types flown</Label>
          <input className={fieldClass} placeholder="e.g. Fixed-wing, VTOL" value={form.droneTypes} onChange={(e) => setForm({ ...form, droneTypes: e.target.value })} />
        </div>

        <div className="sm:col-span-2">
          <label className="flex items-center gap-2 text-sm text-brand-navy-dark">
            <input type="checkbox" checked={grantLogin} onChange={(e) => setGrantLogin(e.target.checked)} />
            Give this pilot a login (requires email above)
          </label>
          {grantLogin && (
            <div className="mt-2 space-y-1.5">
              <Label>Password</Label>
              <input
                type="password"
                required={grantLogin}
                className={fieldClass}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Set an initial password for the pilot"
              />
              <p className="text-xs text-muted-foreground">The pilot signs in at /login with this email and password, then lands on their own portal.</p>
            </div>
          )}
        </div>

        {createPilot.isError && <p className="text-sm text-destructive sm:col-span-2">{createPilot.error.message}</p>}
        <Button type="submit" disabled={createPilot.isPending} className="bg-brand-navy text-white hover:bg-brand-navy/90 sm:col-span-2 sm:w-fit">
          {createPilot.isPending ? "Adding…" : "Add pilot"}
        </Button>
      </form>

      {isLoading && <p className="text-sm text-muted-foreground">Loading pilots…</p>}
      {isError && <p className="text-sm text-destructive">{error.message}</p>}

      {!isLoading && !isError && (
        <div className="overflow-hidden rounded-xl border border-border">
          {pilots?.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">No pilots yet — add one above.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-input/50 text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Drone types</th>
                  <th className="px-4 py-3 font-medium">Login</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pilots?.map((pilot) => (
                  <tr key={pilot.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-brand-navy-dark">{pilot.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{pilot.telephone || pilot.email || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{pilot.droneTypes || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{pilot.user ? "Yes" : "No"}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => updatePilot.mutate({ id: pilot.id, active: !pilot.active })}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          pilot.active
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-gray-100 text-gray-500 border border-gray-200"
                        }`}
                      >
                        {pilot.active ? "Active" : "Inactive"}
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
