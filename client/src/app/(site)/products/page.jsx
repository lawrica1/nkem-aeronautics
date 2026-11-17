import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { PageHero, BTN_PRIMARY, BTN_SECONDARY } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/products/ProductCard";
import { CallToAction } from "@/components/CallToAction";
import { CATALOG_PDF, PRODUCT_FAMILIES } from "@/lib/productRange";
import { getCatalogProducts, inFamily } from "@/lib/productSource";

// Re-read the admin-managed catalogue every 5 minutes.
export const revalidate = 300;

export const metadata = {
  title: "Products — Nkem Aeronautics",
  description:
    "Fixed-wing and VTOL UAVs, multirotor drones, agricultural sprayers and tracked ground robotics, built and supported in Lusaka, Zambia.",
};

function FamilySection({ family, index, products }) {
  const items = inFamily(products, family.id);
  if (items.length === 0) return null;
  return (
    <section id={family.id} className={`scroll-mt-28 px-4 py-16 sm:px-6 sm:py-20 ${index % 2 ? "bg-brand-paper" : "bg-white"}`}>
      <div className="mx-auto max-w-6xl">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_1.1fr]">
          <SectionHeading eyebrow={`Product family ${family.code}`} title={family.name} intro={family.intro} />
          <Reveal className="relative hidden aspect-[16/7] overflow-hidden rounded-2xl lg:block">
            <Image src={family.photo} alt="" fill sizes="50vw" className="object-cover" />
            <span className="absolute bottom-4 left-4 rounded-md bg-brand-blue px-3 py-1.5 font-display text-sm text-white">
              {family.code}
            </span>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <Reveal key={p.slug} delay={i * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <h3 className="font-display text-sm text-brand-black">At a glance</h3>
          <div className="mt-3 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead>
                <tr className="border-b border-brand-black">
                  <th className="px-4 py-3 text-[11px] font-semibold tracking-[0.12em] text-neutral-500 uppercase">Product</th>
                  {family.compare.map((c) => (
                    <th key={c} className="px-4 py-3 text-[11px] font-semibold tracking-[0.12em] text-neutral-500 uppercase">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {items.map((p) => (
                  <tr key={p.slug} className="border-b border-neutral-200 last:border-0">
                    <td className="px-4 py-3">
                      <Link href={`/products/${p.slug}`} className="font-display text-[13px] text-brand-black hover:text-brand-blue">
                        {p.name}
                      </Link>
                    </td>
                    {family.compare.map((c) => (
                      <td key={c} className="px-4 py-3 text-brand-black">
                        {p.compare[c]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {family.id === "partner-drones" && (
            <p className="mt-3 text-xs text-neutral-500">
              DJI, T50 and T100 are trademarks of their respective owner. Nkem Aeronautics supplies these
              third-party products; it does not manufacture them.
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export default async function ProductsPage() {
  const products = await getCatalogProducts();
  const families = PRODUCT_FAMILIES.filter((f) => inFamily(products, f.id).length > 0);
  return (
    <main className="flex-1">
      <PageHero
        image="/images/products/family-fixed-wing.jpg"
        eyebrow="Product Catalog 2026"
        title="Unmanned aircraft, spraying equipment & ground robotics"
        intro={`${products.length} products across ${families.length} families, built and supported in Lusaka, Zambia, for agriculture, survey, conservation, mining and logistics across Africa.`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
      >
        <a href={CATALOG_PDF} download className={BTN_PRIMARY}>
          <Download className="size-4" />
          Download Catalog (PDF)
        </a>
        <Link href="/contact" className={BTN_SECONDARY}>
          Talk to Sales
        </Link>
      </PageHero>

      {/* Family jump bar */}
      <nav aria-label="Product families" className="sticky top-0 z-30 border-y border-neutral-200 bg-white/95 backdrop-blur">
        <ul className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-4 text-xs font-semibold tracking-[0.12em] whitespace-nowrap uppercase sm:px-6">
          {families.map((f) => (
            <li key={f.id}>
              <a href={`#${f.id}`} className="flex items-center gap-2 border-b-2 border-transparent py-4 text-neutral-600 hover:border-brand-blue hover:text-brand-blue">
                <span className="font-display text-brand-blue">{f.code}</span>
                {f.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {families.map((f, i) => (
        <FamilySection key={f.id} family={f} index={i} products={products} />
      ))}

      <section className="bg-white px-4 pt-16 sm:px-6">
        <Reveal className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-2xl border border-neutral-200 bg-brand-paper p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="font-display text-xl text-brand-black sm:text-2xl">The full catalog, ready to share</h2>
            <p className="mt-2 max-w-xl text-sm text-neutral-600">
              22 pages of specifications for every product, formatted for print and email.
            </p>
          </div>
          <a href={CATALOG_PDF} download className={BTN_PRIMARY}>
            Download PDF
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </Reveal>
      </section>

      <CallToAction
        title="Need a configuration for your operation?"
        text="Tell us your crops, terrain or mission and our team will recommend the right platform, training and support."
      />
    </main>
  );
}
