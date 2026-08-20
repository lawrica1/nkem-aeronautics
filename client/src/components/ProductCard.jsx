export function ProductCard({ product }) {
  return (
    <div className="h-full rounded-lg border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <h3 className="text-lg font-semibold text-brand-navy-dark">{product.name}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
      <p className="mt-4 text-sm font-medium text-brand-green">{product.spec}</p>
    </div>
  );
}
