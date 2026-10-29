import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ProductCard } from "@/components/products/ProductCard";
import { PRODUCT_FAMILIES, findProduct } from "@/lib/productRange";

// One flagship per family for the home page; the full range lives on /products.
const FEATURED = ["nkm-agr-100", "nkm-lgs-50", "nkm-ugv-1000", "nkm-ugv-2"];

export function FeaturedProducts() {
  return (
    <section className="bg-brand-paper px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Product Catalog 2026"
            title="Built for the Field"
            intro="Fixed-wing and VTOL UAVs, multirotor drones, ground sprayers and tracked carriers, designed, assembled and supported in Lusaka."
          />
          <Reveal>
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-md bg-brand-blue px-6 py-3 text-xs font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-brand-blue-dark"
            >
              All Products
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>

        <ul className="mt-8 flex flex-wrap gap-2">
          {PRODUCT_FAMILIES.map((f) => (
            <li key={f.id}>
              <Link
                href={`/products#${f.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-medium text-brand-black transition-colors hover:border-brand-blue hover:text-brand-blue"
              >
                <span className="font-display text-brand-blue">{f.code}</span>
                {f.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED.map((slug, i) => (
            <Reveal key={slug} delay={i * 80}>
              <ProductCard product={findProduct(slug)} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
