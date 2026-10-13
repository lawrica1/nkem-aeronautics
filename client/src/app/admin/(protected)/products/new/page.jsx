"use client";

import { useRouter } from "next/navigation";
import { useCreateProduct } from "@/hooks/useProducts";
import { ProductForm } from "../ProductsAdminView";

export default function NewProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();

  return (
    <div>
      {/* Reached from both the Drones and Products pages, so go back to whichever it was. */}
      <button type="button" onClick={() => router.back()} className="text-sm text-brand-blue underline">
        ← Back
      </button>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-brand-navy-dark">Add product</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Add a drone or part to the website &amp; shop catalogue. Leave price blank for &ldquo;Enquire to purchase&rdquo; items.
      </p>
      <div className="mt-8">
        <ProductForm mutation={createProduct} submitLabel="Add product" onDone={() => router.back()} onCancel={() => router.back()} />
      </div>
    </div>
  );
}
