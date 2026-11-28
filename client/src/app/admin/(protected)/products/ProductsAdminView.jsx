"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { useAdminProducts, useUpdateProduct } from "@/hooks/useProducts";
import { TableCard, StatusPill, RowMenu, filterRows, pageRows, thClass, tdClass } from "@/components/admin/AdminTable";
import { PRODUCT_SECTOR_OPTIONS } from "@/lib/adminOptions";
import { formatXAF } from "@/lib/currency";
import { specRows } from "@/lib/catalog";
import { PRODUCT_FAMILIES } from "@/lib/productRange";
import { CROP_OPTIONS, SERVICE_OPTIONS } from "@/components/AgriDroneFilter";
import { FileUpload } from "@/components/portal/FileUpload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30";

function toForm(product) {
  return {
    sector: product?.sector ?? "agricultural",
    name: product?.name ?? "",
    type: product?.type ?? "",
    model: product?.model ?? "",
    price: product?.price ?? "",
    availability: product?.availability ?? "",
    description: product?.description ?? "",
    highlight: product?.highlight ?? "",
    tags: (product?.tags ?? []).join(", "),
    crops: product?.crops ?? [],
    service: product?.service ?? "",
    specList: specRows(product?.specs),
    family: product?.family ?? "",
    sortOrder: product?.sortOrder ?? 0,
    tagline: product?.tagline ?? "",
    thirdParty: product?.thirdParty ?? false,
    keyFigures: [0, 1, 2].map((i) => ({ value: product?.keyFigures?.[i]?.value ?? "", label: product?.keyFigures?.[i]?.label ?? "" })),
    compare: product?.compare && typeof product.compare === "object" ? product.compare : {},
    // FileUpload works with asset objects; stored products only keep the URLs.
    images: (product?.images ?? []).map((url) => ({ id: url, url, mimeType: "image/", originalName: url.split("/").pop() })),
  };
}

// Specs with a group name are saved as [{ group, rows }] (shown as separate tables on the Products
// pages); without any group they stay simple [label, value] pairs.
function specsPayload(specList) {
  const rows = specList.filter((s) => s.label.trim());
  if (!rows.some((s) => s.group.trim())) return rows.map((s) => [s.label.trim(), s.value.trim()]);
  const groups = [];
  for (const s of rows) {
    const name = s.group.trim() || "Specifications";
    let g = groups.find((x) => x.group === name);
    if (!g) groups.push((g = { group: name, rows: [] }));
    g.rows.push([s.label.trim(), s.value.trim()]);
  }
  return groups;
}

// Only the chosen family's "At a glance" columns are saved; blank ones fall back to a same-named spec.
function comparePayload(familyId, compare) {
  const columns = PRODUCT_FAMILIES.find((f) => f.id === familyId)?.compare ?? [];
  const filled = columns.filter((col) => String(compare[col] ?? "").trim()).map((col) => [col, String(compare[col]).trim()]);
  return filled.length ? Object.fromEntries(filled) : null;
}

function toPayload({ specList, keyFigures, compare, ...form }) {
  return {
    ...form,
    compare: comparePayload(form.family, compare),
    tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    service: form.service || null,
    family: form.family || null,
    sortOrder: Number(form.sortOrder) || 0,
    keyFigures: keyFigures.filter((k) => k.value.trim() && k.label.trim()).map((k) => ({ value: k.value.trim(), label: k.label.trim() })),
    specs: specsPayload(specList),
    images: form.images.map((img) => img.url),
  };
}

export function ProductForm({ product, mutation, submitLabel, onDone, onCancel }) {
  const [form, setForm] = useState(() => toForm(product));

  function setSpec(index, key, value) {
    setForm({ ...form, specList: form.specList.map((s, i) => (i === index ? { ...s, [key]: value } : s)) });
  }

  function toggleCrop(crop) {
    const crops = form.crops.includes(crop) ? form.crops.filter((c) => c !== crop) : [...form.crops, crop];
    setForm({ ...form, crops });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate(product ? { id: product.id, ...toPayload(form) } : toPayload(form), {
          onSuccess: () => {
            if (!product) setForm(toForm());
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
        <Label>Sector</Label>
        <select className={fieldClass} value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })}>
          {PRODUCT_SECTOR_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label>Name</Label>
        <input className={fieldClass} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Label>Type</Label>
        <input className={fieldClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Label>Model</Label>
        <input className={fieldClass} value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Label>Price (XAF) <span className="font-normal text-muted-foreground">— blank = enquire</span></Label>
        <input type="number" min="0" className={fieldClass} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Label>Availability note</Label>
        <input className={fieldClass} placeholder="e.g. MOQ: 1 set" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label>Description</Label>
        <textarea rows={3} className={fieldClass} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Label>Key spec <span className="font-normal text-muted-foreground">— one line on the website card</span></Label>
        <input className={fieldClass} placeholder="e.g. Payload: 16 Liters" value={form.highlight} onChange={(e) => setForm({ ...form, highlight: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Label>Tags <span className="font-normal text-muted-foreground">— comma separated</span></Label>
        <input className={fieldClass} placeholder="e.g. Agricultural, Spraying, Electric" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
      </div>

      {form.sector === "agricultural" && (
        <>
          <div className="space-y-1.5">
            <Label>Crops <span className="font-normal text-muted-foreground">— website filter</span></Label>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {CROP_OPTIONS.filter((c) => c.value !== "all").map((c) => (
                <label key={c.value} className="flex items-center gap-1.5 text-sm text-brand-navy-dark">
                  <input type="checkbox" checked={form.crops.includes(c.value)} onChange={() => toggleCrop(c.value)} />
                  {c.label.split(" (")[0]}
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Service <span className="font-normal text-muted-foreground">— website filter</span></Label>
            <select className={fieldClass} value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
              <option value="">—</option>
              {SERVICE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </>
      )}

      <fieldset className="grid gap-4 rounded-xl border border-border p-4 sm:col-span-2 sm:grid-cols-2">
        <legend className="px-1 text-sm font-semibold text-brand-navy-dark">Products pages (/products)</legend>
        <div className="space-y-1.5">
          <Label>Product family <span className="font-normal text-muted-foreground">— where it is listed</span></Label>
          <select className={fieldClass} value={form.family} onChange={(e) => setForm({ ...form, family: e.target.value })}>
            <option value="">Not listed on the Products pages</option>
            {PRODUCT_FAMILIES.map((f) => (
              <option key={f.id} value={f.id}>{f.code} · {f.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Display order <span className="font-normal text-muted-foreground">— lower shows first</span></Label>
          <input type="number" className={fieldClass} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Tagline <span className="font-normal text-muted-foreground">— one sentence under the name</span></Label>
          <input className={fieldClass} placeholder="e.g. Long-range survey platform for forest surveys and aerial mapping." value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Headline figures <span className="font-normal text-muted-foreground">— up to three, e.g. 2,700 mm / Wingspan</span></Label>
          <div className="grid gap-2 sm:grid-cols-3">
            {form.keyFigures.map((k, i) => (
              <div key={i} className="flex gap-2">
                <input className={fieldClass} placeholder="Value" value={k.value} onChange={(e) => setForm({ ...form, keyFigures: form.keyFigures.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)) })} />
                <input className={fieldClass} placeholder="Label" value={k.label} onChange={(e) => setForm({ ...form, keyFigures: form.keyFigures.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} />
              </div>
            ))}
          </div>
        </div>
        {form.family && (
          <div className="space-y-2 sm:col-span-2">
            <Label>
              At a glance <span className="font-normal text-muted-foreground">— the comparison table on the family page; a blank box uses the spec with the same name</span>
            </Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {PRODUCT_FAMILIES.find((f) => f.id === form.family)?.compare.map((col) => (
                <div key={col} className="space-y-1">
                  <label htmlFor={`compare-${col}`} className="text-xs text-muted-foreground">{col}</label>
                  <input
                    id={`compare-${col}`}
                    className={fieldClass}
                    value={form.compare[col] ?? ""}
                    onChange={(e) => setForm({ ...form, compare: { ...form.compare, [col]: e.target.value } })}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        <label className="flex items-center gap-2 text-sm text-brand-navy-dark sm:col-span-2">
          <input type="checkbox" checked={form.thirdParty} onChange={(e) => setForm({ ...form, thirdParty: e.target.checked })} />
          Partner product (made by another company, e.g. DJI). Adds a trademark note.
        </label>
      </fieldset>

      <div className="space-y-2 sm:col-span-2">
        <Label>Specs <span className="font-normal text-muted-foreground">— the group (e.g. Airframe, Performance) is optional</span></Label>
        {form.specList.map((spec, i) => (
          <div key={i} className="flex gap-2">
            <input className={`${fieldClass} sm:max-w-40`} placeholder="Group" value={spec.group} onChange={(e) => setSpec(i, "group", e.target.value)} />
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
          onClick={() => setForm({ ...form, specList: [...form.specList, { group: form.specList.at(-1)?.group ?? "", label: "", value: "" }] })}
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
          purpose="product-photos"
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

export function ProductsAdminView({ title = "Products" }) {
  const { data: products, isLoading, isError, error } = useAdminProducts();
  const updateProduct = useUpdateProduct();
  const router = useRouter();
  const [filters, setFilters] = useState({ status: "all", search: "", page: 1 });
  const rows = filterRows(products, filters, ["name", "model", "type", "sector"]);

  return (
    <TableCard
      title={title}
      filters={filters}
      onFiltersChange={setFilters}
      addHref="/admin/products/new"
      addLabel="Add product"
      count={rows.length}
    >
      {isLoading && <p className="px-6 py-10 text-center text-sm text-muted-foreground">Loading products…</p>}
      {isError && <p className="px-6 py-10 text-center text-sm text-destructive">{error.message}</p>}
      {updateProduct.isError && <p className="px-6 py-2 text-sm text-destructive">{updateProduct.error.message}</p>}

      {!isLoading && !isError && rows.length > 0 && (
        <table className="w-full text-left text-sm">
          <thead className="border-y border-border bg-slate-50">
            <tr>
              <th className={thClass}>Name</th>
              <th className={thClass}>Model</th>
              <th className={thClass}>Sector</th>
              <th className={thClass}>Price</th>
              <th className={thClass}>Status</th>
              <th className={thClass}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pageRows(rows, filters.page).map((product) => (
                <tr key={product.id} className="transition-colors hover:bg-slate-50">
                  <td className={`${tdClass} font-medium text-brand-navy-dark`}>
                    <div className="flex items-center gap-3">
                      {product.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.images[0]} alt={product.name} className="size-9 shrink-0 rounded-lg object-cover" />
                      ) : (
                        <div className="size-9 shrink-0 rounded-lg bg-slate-100" />
                      )}
                      {product.name}
                    </div>
                  </td>
                  <td className={`${tdClass} text-muted-foreground`}>{product.model || "—"}</td>
                  <td className={`${tdClass} text-muted-foreground capitalize`}>{product.sector}</td>
                  <td className={`${tdClass} text-brand-navy-dark`}>{formatXAF(product.price)}</td>
                  <td className={tdClass}>
                    <StatusPill active={product.active} />
                  </td>
                  <td className={tdClass}>
                    <RowMenu
                      items={[
                        { label: "View", onClick: () => router.push(`/admin/products/${product.id}`) },
                        { label: "Edit", onClick: () => router.push(`/admin/products/${product.id}/edit`) },
                        { label: product.active ? "Deactivate" : "Activate", onClick: () => updateProduct.mutate({ id: product.id, active: !product.active }) },
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
