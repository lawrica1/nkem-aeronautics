import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { SERVICES } from "@/lib/services";
import { CATALOG_SECTORS } from "@/lib/catalog";
import { CatalogSection } from "../../CatalogSection";
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
      <section className="relative overflow-hidden bg-brand-navy px-6 py-24 text-white sm:py-32">
        {service.hero?.image ? (
          <>
            <Image src={hero.image} alt="" fill priority className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-navy-dark/95 via-brand-navy-dark/75 to-brand-navy-dark/20" />
          </>
        ) : (
          <Image src={hero.image} alt="" fill priority className="object-cover opacity-25" sizes="100vw" />
        )}
        <div className="relative mx-auto max-w-6xl">
          <Link href="/services" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white">
            <ArrowLeft className="size-4" />
            All services
          </Link>
          <div className="mt-6 flex size-12 items-center justify-center rounded-xl bg-brand-blue">
            <Icon className="size-6 text-white" />
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold sm:text-5xl">{hero.title}</h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">{hero.description}</p>
          <ul className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
            {service.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-white/90">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-blue" />
                {f}
              </li>
            ))}
          </ul>
          <Link
            href={service.ctaHref}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-brand-blue px-8 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-brand-blue-dark"
          >
            {service.cta}
            <ArrowRight className="size-4" />
          </Link>
        </div>
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
        <section className="bg-brand-navy px-6 py-20 text-center text-white">
          <h2 className="text-3xl font-bold">Talk to our team about {service.title.toLowerCase()}</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Tell us about your site and requirements and we will recommend the right inspection approach.
          </p>
          <Link
            href={service.ctaHref}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-blue px-10 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-brand-blue-dark"
          >
            {service.cta}
            <ArrowRight className="size-4" />
          </Link>
        </section>
      )}
    </main>
  );
}
