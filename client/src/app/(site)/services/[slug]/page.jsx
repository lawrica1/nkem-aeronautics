import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PageHero, BTN_PRIMARY, BTN_SECONDARY } from "@/components/PageHero";
import { SERVICES } from "@/lib/services";
import { CATALOG_SECTORS } from "@/lib/catalog";
import { CatalogSection } from "../../CatalogSection";
import { QuoteRequestForm } from "@/components/QuoteRequestForm";
import { ServiceSection } from "./ServiceSection";

const findService = (slug) => SERVICES.find((s) => s.slug === slug);

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const service = findService((await params).slug);
  if (!service) return {};
  return { title: `${service.title} — Nkem Aeronautics`, description: service.description };
}

export default async function ServiceDetailPage({ params }) {
  const service = findService((await params).slug);
  if (!service) notFound();
  const Icon = service.icon;
  const hasCatalog = CATALOG_SECTORS.some((s) => s.id === service.slug);
  const hero = { ...service, ...service.hero };
  const nav = service.sections?.filter((s) => s.nav) ?? [];

  return (
    <main className="flex-1">
      <PageHero
        image={hero.image}
        eyebrow="Services"
        title={hero.title}
        intro={hero.description}
        crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: service.title }]}
      >
        <Link href={service.ctaHref} className={BTN_PRIMARY}>
          {service.cta}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link href="/products" className={BTN_SECONDARY}>
          View Products
        </Link>
      </PageHero>
      <section className="bg-brand-paper px-4 pb-12 sm:px-6">
        <ul className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {service.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 rounded-xl border border-neutral-200 bg-white p-4 text-sm text-brand-black">
              <Icon className="mt-0.5 size-4 shrink-0 text-brand-blue" />
              {f}
            </li>
          ))}
        </ul>
      </section>

      {nav.length > 0 && (
        <nav className="sticky top-0 z-30 border-b border-border bg-white/90 backdrop-blur">
          <ul className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-6 text-sm font-medium whitespace-nowrap text-brand-navy-dark/70">
            {nav.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="block border-b-2 border-transparent py-4 hover:border-brand-blue hover:text-brand-blue">
                  {s.nav}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {service.sections?.map((section, i) => (
        <ServiceSection key={i} section={section} alt={i % 2 === 1} />
      ))}

      {hasCatalog && <CatalogSection sector={service.slug} />}

      {!hasCatalog && (
        <section className="bg-white px-6 py-20">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-brand-paper px-6 py-10 text-center sm:px-10">
              <h2 className="font-display text-xl font-normal tracking-tight text-brand-black">Talk to our team about {service.title.toLowerCase()}</h2>
              <p className="mt-2 max-w-xl text-sm text-neutral-600">
                Tell us about your site and requirements and we will recommend the right inspection approach.
              </p>
              <Link
                href={service.ctaHref}
                className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-brand-blue px-8 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-brand-blue-dark"
              >
                {service.cta}
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <QuoteRequestForm sector={service.slug} />
          </div>
        </section>
      )}
    </main>
  );
}
