"use client";

import { Fragment, useState } from "react";
import { Plus, X } from "lucide-react";
import { useDrones, useCreateDrone, useUpdateDrone } from "@/hooks/usePilotsAndDrones";
import { FileUpload } from "@/components/portal/FileUpload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30";

const EMPTY_SPEC = { label: "", value: "" };

function toForm(drone) {
  return {
    name: drone?.name ?? "",
    model: drone?.model ?? "",
    type: drone?.type ?? "",
    specList: drone?.specList?.length ? drone.specList : [EMPTY_SPEC],
    // FileUpload works with asset objects; stored drones only keep the URLs.
    images: (drone?.images ?? []).map((url) => ({ id: url, url, mimeType: "image/", originalName: url.split("/").pop() })),
  };
}

function toPayload(form) {
  return {
    name: form.name,
    model: form.model,
    type: form.type,
    specList: form.specList.filter((s) => s.label.trim() || s.value.trim()),
    images: form.images.map((img) => img.url),
  };
}

function DroneForm({ drone, mutation, submitLabel, onDone, onCancel }) {
  const [form, setForm] = useState(() => toForm(drone));

  function setSpec(index, key, value) {
    setForm({ ...form, specList: form.specList.map((s, i) => (i === index ? { ...s, [key]: value } : s)) });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate(drone ? { id: drone.id, ...toPayload(form) } : toPayload(form), {
          onSuccess: () => {
            if (!drone) setForm(toForm());
            onDone?.();
          },
        });
      }}
      className="grid gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm sm:grid-cols-2"
    >
      <div className="space-y-1.5">
        <Label>Name</Label>
        <input className={fieldClass} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Label>Model</Label>
        <input className={fieldClass} value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label>Type</Label>
        <input className={fieldClass} placeholder="e.g. Fixed-wing, Multirotor" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label>Specs</Label>
        {form.specList.map((spec, i) => (
          <div key={i} className="flex gap-2">
            <input className={fieldClass} placeholder="e.g. Tank capacity" value={spec.label} onChange={(e) => setSpec(i, "label", e.target.value)} />
            <input className={fieldClass} placeholder="e.g. 20 L" value={spec.value} onChange={(e) => setSpec(i, "value", e.target.value)} />
            <button
              type="button"
              onClick={() => setForm({ ...form, specList: form.specList.filter((_, j) => j !== i) })}
              className="shrink-0 rounded-lg px-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              aria-label="Remove spec"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setForm({ ...form, specList: [...form.specList, EMPTY_SPEC] })}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue hover:underline"
        >
          <Plus className="size-4" /> Add spec
        </button>
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label>Pictures</Label>
        <FileUpload
          value={form.images}
          onChange={(images) => setForm({ ...form, images })}
          accept="image/jpeg,image/png,image/webp"
          maxFiles={10}
          purpose="drone-photos"
          admin
        />
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

function SpecSummary({ drone }) {
  if (drone.specList?.length) {
    return (
      <ul className="space-y-0.5">
        {drone.specList.map((s, i) => (
          <li key={i}>
            <span className="font-medium text-brand-navy-dark">{s.label}</span>
            {s.label && s.value ? ": " : ""}
            {s.value}
          </li>
        ))}
      </ul>
    );
  }
  return drone.specs || "—";
}

export function DronesAdminView() {
  const { data: drones, isLoading, isError, error } = useDrones();
  const createDrone = useCreateDrone();
  const updateDrone = useUpdateDrone();
  const [editingId, setEditingId] = useState(null);

  return (
    <div className="space-y-6">
      <DroneForm mutation={createDrone} submitLabel="Add drone" />

      {isLoading && <p className="text-sm text-muted-foreground">Loading drones…</p>}
      {isError && <p className="text-sm text-destructive">{error.message}</p>}

      {!isLoading && !isError && (
        <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-sm">
          {drones?.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">No drones yet — add one above.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-slate-50 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Drone</th>
                  <th className="px-4 py-3 font-medium">Model / Type</th>
                  <th className="px-4 py-3 font-medium">Specs</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {drones?.map((drone) => (
                  <Fragment key={drone.id}>
                    <tr className="align-top transition-colors hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {drone.images?.[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={drone.images[0]} alt={drone.name} className="size-12 shrink-0 rounded-lg object-cover" />
                          ) : (
                            <div className="size-12 shrink-0 rounded-lg bg-slate-100" />
                          )}
                          <div>
                            <p className="font-medium text-brand-navy-dark">{drone.name}</p>
                            {drone.images?.length > 1 && (
                              <p className="text-xs text-muted-foreground">{drone.images.length} pictures</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{[drone.model, drone.type].filter(Boolean).join(" · ") || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        <SpecSummary drone={drone} />
                      </td>
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
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setEditingId(editingId === drone.id ? null : drone.id)}
                          className="text-sm font-medium text-brand-blue hover:underline"
                        >
                          {editingId === drone.id ? "Close" : "Edit"}
                        </button>
                      </td>
                    </tr>
                    {editingId === drone.id && (
                      <tr>
                        <td colSpan={5} className="bg-slate-50 p-4">
                          <DroneForm
                            drone={drone}
                            mutation={updateDrone}
                            submitLabel="Save changes"
                            onDone={() => setEditingId(null)}
                            onCancel={() => setEditingId(null)}
                          />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
