"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { useDrones, useUpdateDrone } from "@/hooks/usePilotsAndDrones";
import { TableCard, StatusPill, RowMenu, filterRows, pageRows, thClass, tdClass } from "@/components/admin/AdminTable";
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

export function DroneForm({ drone, mutation, submitLabel, onDone, onCancel }) {
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
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="justify-self-start text-sm text-brand-blue underline sm:col-span-2"
        >
          ← Back to list
        </button>
      )}
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

export function DronesAdminView() {
  const { data: drones, isLoading, isError, error } = useDrones();
  const updateDrone = useUpdateDrone();
  const router = useRouter();
  const [filters, setFilters] = useState({ status: "all", search: "", page: 1 });
  const rows = filterRows(drones, filters, ["name", "model", "type"]);

  return (
    <TableCard
      title="Operational fleet"
      filters={filters}
      onFiltersChange={setFilters}
      addHref="/admin/drones/new"
      addLabel="Add drone"
      count={rows.length}
    >
      {isLoading && <p className="px-6 py-10 text-center text-sm text-muted-foreground">Loading drones…</p>}
      {isError && <p className="px-6 py-10 text-center text-sm text-destructive">{error.message}</p>}
      {updateDrone.isError && <p className="px-6 py-2 text-sm text-destructive">{updateDrone.error.message}</p>}

      {!isLoading && !isError && rows.length > 0 && (
        <table className="w-full text-left text-sm">
          <thead className="border-y border-border bg-slate-50">
            <tr>
              <th className={thClass}>Name</th>
              <th className={thClass}>Model</th>
              <th className={thClass}>Type</th>
              <th className={thClass}>Specs</th>
              <th className={thClass}>Status</th>
              <th className={thClass}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pageRows(rows, filters.page).map((drone) => (
                <tr key={drone.id} className="transition-colors hover:bg-slate-50">
                  <td className={`${tdClass} font-medium text-brand-navy-dark`}>
                    <div className="flex items-center gap-3">
                      {drone.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={drone.images[0]} alt={drone.name} className="size-9 shrink-0 rounded-lg object-cover" />
                      ) : (
                        <div className="size-9 shrink-0 rounded-lg bg-slate-100" />
                      )}
                      {drone.name}
                    </div>
                  </td>
                  <td className={`${tdClass} text-muted-foreground`}>{drone.model || "—"}</td>
                  <td className={`${tdClass} text-muted-foreground`}>{drone.type || "—"}</td>
                  <td className={tdClass}>
                    <span
                      title={drone.specList?.map((s) => [s.label, s.value].filter(Boolean).join(": ")).join("\n") || drone.specs || ""}
                      className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                        drone.specList?.length ? "bg-blue-50 text-brand-blue" : "bg-slate-100 text-muted-foreground"
                      }`}
                    >
                      {drone.specList?.length ?? 0} specs
                    </span>
                  </td>
                  <td className={tdClass}>
                    <StatusPill active={drone.active} />
                  </td>
                  <td className={tdClass}>
                    <RowMenu
                      items={[
                        { label: "View", onClick: () => router.push(`/admin/drones/${drone.id}`) },
                        { label: "Edit", onClick: () => router.push(`/admin/drones/${drone.id}/edit`) },
                        { label: drone.active ? "Deactivate" : "Activate", onClick: () => updateDrone.mutate({ id: drone.id, active: !drone.active }) },
                      ]}
                    />
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      )}
    </TableCard>
  );
}
