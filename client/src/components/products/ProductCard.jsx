import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Pale gradient tile that product cut-outs and white-background shots sit on.
export function ProductImage({ product, className, sizes = "(max-width: 768px) 100vw, 33vw", priority = false }) {
  const photo = product.thirdParty; // partner kits are lifestyle photos, shown full-bleed
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#f3f5f9] to-[#e6ebf6]",
        className,
      )}
    >
      <Image
        src={product.image}
        alt={product.name}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(photo ? "object-cover" : "object-contain p-[8%] mix-blend-multiply")}
      />
    </div>
  );
}

export function ProductCard({ product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-3 transition-shadow hover:shadow-[0_20px_50px_-28px_rgba(11,13,18,0.45)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
    >
      <ProductImage product={product} className="aspect-[4/3]" />
      <div className="flex flex-1 flex-col px-2 pt-4 pb-2">
        <p className="min-h-4 text-[11px] font-semibold tracking-[0.14em] text-brand-blue uppercase">
          {product.model && product.model !== product.name ? `Model ${product.model}` : " "}
        </p>
        <h3 className="mt-1.5 font-display text-base leading-snug font-normal tracking-tight text-brand-black">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600">{product.tagline}</p>
        <dl className="mt-4 grid grid-cols-3 border-t border-neutral-200 pt-3">
          {product.keyFigures.map((k, i) => (
            <div key={k.label} className={cn("flex min-w-0 flex-col-reverse", i > 0 && "border-l border-neutral-200 pl-2.5")}>
              <dt className="mt-0.5 truncate text-[10px] tracking-wide text-neutral-500 uppercase">{k.label}</dt>
              <dd className="truncate font-display text-[13px] text-brand-black">{k.value}</dd>
            </div>
          ))}
        </dl>
        <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] text-brand-blue uppercase">
          View specifications
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
