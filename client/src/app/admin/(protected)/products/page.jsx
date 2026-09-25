import { ProductsAdminView } from "./ProductsAdminView";

export default function AdminProductsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-brand-navy-dark">Products</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        The sellable catalogue — drones and parts customers can order. Leave price blank for
        &ldquo;Enquire to purchase&rdquo; items.
      </p>
      <div className="mt-8">
        <ProductsAdminView />
      </div>
    </div>
  );
}
