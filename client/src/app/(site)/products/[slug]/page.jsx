import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Download } from "lucide-react";
import { Eyebrow, SectionHeading } from "@/components/SectionHeading";
import { BTN_SECONDARY } from "@/components/PageHero";
import { ProductCard, ProductImage } from "@/components/products/ProductCard";
import { QuoteRequestForm } from "@/components/QuoteRequestForm";
import { CATALOG_PDF, PRODUCT_RANGE, findFamily, findProduct, productsInFamily } from "@/lib/productRange";

export function generateStaticParams() {
  return PRODUCT_RANGE.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const product = findProduct((await params).slug);
  if (!product) return {};
  return { title: `${product.name} — Nkem Aeronautics`, description: product.tagline };
}

export default async function ProductDetailPage({ params }) {
  const product = findProduct((await params).slug);
  if (!product) notFound();
  const family = findFamily(product.family);
  const related = productsInFamily(family.id).filter((p) => p.slug !== product.slug);

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-neutral-500">
            <li><Link href="/" className="hover:text-brand-blue">Home</Link></li>
            <li className="flex items-center gap-1"><ChevronRight className="size-3" /><Link href="/products" className="hover:text-brand-blue">Products</Link></li>
            <li className="flex items-center gap-1"><ChevronRight className="size-3" /><Link href={`/products#${family.id}`} className="hover:text-brand-blue">{family.name}</Link></li>
            <li className="flex items-center gap-1"><ChevronRight className="size-3" /><span aria-current="page" className="text-brand-black">{product.name}</span></li>
          </ol>
        </nav>
      </div>

      {/* Product header */}
      <section className="px-4 pt-6 pb-14 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <ProductImage product={product} priority className="aspect-[4/3.2]" sizes="(max-width: 1024px) 100vw, 55vw" />
          <div className="flex flex-col">
            <Eyebrow>{family.name}</Eyebrow>
            {product.model && (
              <p className="mt-5 text-xs font-semibold tracking-[0.14em] text-brand-blue uppercase">Model {product.model}</p>
            )}
            <h1 className="mt-2 font-display text-3xl leading-[1.12] font-normal tracking-[-0.02em] text-balance text-brand-black sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-neutral-600">{product.tagline}</p>
            {product.description && (
              <p className="mt-4 rounded-xl bg-brand-gray-light p-4 text-sm leading-relaxed text-brand-black">{product.description}</p>
            )}
            <dl className="mt-8 grid grid-cols-3 border-t-2 border-brand-black pt-4">
              {product.keyFigures.map((k, i) => (
                <div key={k.label} className={`flex flex-col-reverse ${i > 0 ? "border-l border-neutral-200 pl-4" : ""}`}>
                  <dt className="mt-1 text-[10px] tracking-[0.1em] text-neutral-500 uppercase sm:text-[11px]">{k.label}</dt>
                  <dd className="font-display text-lg text-brand-black sm:text-xl">{k.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 flex flex-wrap gap-2">
              {product.applications.map((a) => (
                <span key={a} className="rounded-full border border-neutral-200 bg-brand-paper px-3 py-1 text-xs text-brand-black">
                  {a}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#quote" className="group inline-flex items-center gap-2 rounded-md bg-brand-blue px-6 py-3 text-xs font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-brand-blue-dark">
                Request a Quote
              </a>
              <a href={CATALOG_PDF} download className={BTN_SECONDARY}>
                <Download className="size-4" />
                Catalog PDF
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="bg-brand-paper px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Technical data" title="Specifications" />
          <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
            {product.specs.map((g) => (
              <div key={g.group}>
                <h3 className="flex items-center gap-2 border-b-2 border-brand-black pb-2 font-display text-sm text-brand-black">
                  <span className="size-2 rounded-sm bg-brand-blue" />
                  {g.group}
                </h3>
                <table className="w-full text-sm">
                  <tbody className="tabular-nums">
                    {g.rows.map(([label, value]) => (
                      <tr key={label} className="border-b border-neutral-200">
                        <th scope="row" className="w-1/2 py-2.5 pr-4 text-left font-normal text-neutral-500">{label}</th>
                        <td className="py-2.5 font-medium text-brand-black">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-neutral-500">
            Specifications are provided for guidance and may change without notice.
            {product.thirdParty && " DJI, T50 and T100 are trademarks of their respective owner; Nkem Aeronautics supplies but does not manufacture this product."}
          </p>
        </div>
      </section>

      {/* Quote */}
      <section id="quote" className="scroll-mt-6 px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2">
          <div>
            <Eyebrow>Pricing & availability</Eyebrow>
            <h2 className="mt-4 font-display text-2xl leading-snug font-normal tracking-tight text-brand-black sm:text-3xl">
              Get a quote for the {product.name}
            </h2>
            <p className="mt-4 text-neutral-600">
              Our sales team replies with pricing, lead time, training and delivery options for your
              country. Prefer to talk? Message us on WhatsApp at +237 670 439 117.
            </p>
          </div>
          <QuoteRequestForm sector={family.quoteSector} defaultProduct={product.name} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-neutral-200 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow={family.name} title="Related products" />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.slice(0, 3).map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
