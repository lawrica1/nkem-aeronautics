"use client";

import { useState } from "react";
import { useDrones, useCreateDrone, useUpdateDrone } from "@/hooks/usePilotsAndDrones";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30";

export function DronesAdminView() {
  const { data: drones, isLoading, isError, error } = useDrones();
  const createDrone = useCreateDrone();
  const updateDrone = useUpdateDrone();
  const [form, setForm] = useState({ name: "", model: "", type: "", specs: "" });

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createDrone.mutate(form, { onSuccess: () => setForm({ name: "", model: "", type: "", specs: "" }) });
        }}
        className="grid gap-4 rounded-xl border border-border p-4 sm:grid-cols-2"
      >
        <div className="space-y-1.5">
          <Label>Name</Label>
          <input className={fieldClass} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Model</Label>
          <input className={fieldClass} value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Type</Label>
          <input className={fieldClass} placeholder="e.g. Fixed-wing, Multirotor" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Specs</Label>
          <input className={fieldClass} placeholder="e.g. 20L tank, 25 min flight time" value={form.specs} onChange={(e) => setForm({ ...form, specs: e.target.value })} />
        </div>
        {createDrone.isError && <p className="text-sm text-destructive sm:col-span-2">{createDrone.error.message}</p>}
        <Button type="submit" disabled={createDrone.isPending} className="bg-brand-navy text-white hover:bg-brand-navy/90 sm:col-span-2 sm:w-fit">
          {createDrone.isPending ? "Adding…" : "Add drone"}
        </Button>
      </form>

      {isLoading && <p className="text-sm text-muted-foreground">Loading drones…</p>}
      {isError && <p className="text-sm text-destructive">{error.message}</p>}

      {!isLoading && !isError && (
        <div className="overflow-hidden rounded-xl border border-border">
          {drones?.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">No drones yet — add one above.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-input/50 text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Model / Type</th>
                  <th className="px-4 py-3 font-medium">Specs</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {drones?.map((drone) => (
                  <tr key={drone.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-brand-navy-dark">{drone.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{[drone.model, drone.type].filter(Boolean).join(" · ") || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{drone.specs || "—"}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => updateDrone.mutate({ id: drone.id, active: !drone.active })}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          drone.active
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-gray-100 text-gray-500 border border-gray-200"
                        }`}
                      >
                        {drone.active ? "Active" : "Inactive"}
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
