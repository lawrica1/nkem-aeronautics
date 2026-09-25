export function ProductCard({ product }) {
  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {product.image && (
        <div className="mb-5 aspect-[4/3] overflow-hidden rounded-md bg-brand-input">
          <img src={product.image} alt={product.name} className="size-full object-contain" />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {product.tags?.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-brand-green/10 px-2.5 py-1 text-xs font-medium text-brand-green"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="mt-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
        {product.brand ?? "Nkem Aeronautics"}
      </p>
      <h3 className="mt-4 text-lg font-semibold text-brand-navy-dark">{product.name}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
      <p className="mt-4 text-sm font-medium text-brand-green">{product.spec}</p>

      {product.availability && (
        <p className="mt-2 text-sm font-medium text-brand-navy-dark">{product.availability}</p>
      )}

      {product.specs?.length > 0 && (
        <dl className="mt-5 grid gap-3 border-t border-border pt-5 text-sm">
          {product.specs.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-3">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="font-medium text-brand-navy-dark">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      <a
        href="/contact"
        className="mt-6 inline-flex w-fit rounded-full bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-brand-navy/90"
      >
        Request Pricing
      </a>
    </div>
  );
}
