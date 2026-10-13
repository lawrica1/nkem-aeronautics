"use client";

import { useParams, useRouter } from "next/navigation";
import { useAdminProducts, useUpdateProduct } from "@/hooks/useProducts";
import { ProductForm } from "../../ProductsAdminView";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: products, isLoading, isError, error } = useAdminProducts();
  const updateProduct = useUpdateProduct();
  const product = products?.find((p) => p.id === id);

  return (
    <div>
      {/* Reached from both the Drones and Products pages, so go back to whichever it was. */}
      <button type="button" onClick={() => router.back()} className="text-sm text-brand-blue underline">
        ← Back
      </button>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-brand-navy-dark">Edit product</h1>
      <div className="mt-8">
        {isLoading && <p className="text-sm text-muted-foreground">Loading product…</p>}
        {isError && <p className="text-sm text-destructive">{error.message}</p>}
        {products && !product && <p className="text-sm text-muted-foreground">Product not found.</p>}
        {product && (
          <ProductForm product={product} mutation={updateProduct} submitLabel="Save changes" onDone={() => router.back()} onCancel={() => router.back()} />
        )}
      </div>
    </div>
  );
}
