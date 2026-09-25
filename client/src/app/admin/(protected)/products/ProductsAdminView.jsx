"use client";

import { useState } from "react";
import { useAdminProducts, useCreateProduct, useUpdateProduct } from "@/hooks/useProducts";
import { PRODUCT_SECTOR_OPTIONS } from "@/lib/adminOptions";
import { formatXAF } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30";

const EMPTY_FORM = { sector: "agricultural", name: "", type: "", model: "", price: "", availability: "" };

export function ProductsAdminView() {
  const { data: products, isLoading, isError, error } = useAdminProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const [form, setForm] = useState(EMPTY_FORM);

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createProduct.mutate(form, { onSuccess: () => setForm(EMPTY_FORM) });
        }}
        className="grid gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm sm:grid-cols-2"
      >
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
        {createProduct.isError && <p className="text-sm text-destructive sm:col-span-2">{createProduct.error.message}</p>}
        <Button type="submit" disabled={createProduct.isPending} className="bg-brand-navy text-white hover:bg-brand-navy/90 sm:col-span-2 sm:w-fit">
          {createProduct.isPending ? "Adding…" : "Add product"}
        </Button>
      </form>

      {isLoading && <p className="text-sm text-muted-foreground">Loading products…</p>}
      {isError && <p className="text-sm text-destructive">{error.message}</p>}

      {!isLoading && !isError && (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          {products?.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">No products yet — add one above.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-slate-50 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Sector</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products?.map((product) => (
                  <tr key={product.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-brand-navy-dark">
                      {product.name}
                      {product.model ? <span className="ml-1 text-muted-foreground">({product.model})</span> : null}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{product.sector}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatXAF(product.price)}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => updateProduct.mutate({ id: product.id, active: !product.active })}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          product.active
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-gray-100 text-gray-500 border border-gray-200"
                        }`}
                      >
                        {product.active ? "Active" : "Inactive"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {updateProduct.isError && (
            <p className="mt-2 text-sm text-destructive">{updateProduct.error.message}</p>
          )}
        </div>
      )}
    </div>
  );
}
