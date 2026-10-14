import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Eyebrow } from "@/components/SectionHeading";
import { SERVICES } from "@/lib/services";
import { cn } from "@/lib/utils";

function ServiceRow({ service, index }) {
  const href = `/services/${service.slug}`;
  const flip = index % 2 === 1;
  return (
    <Reveal
      as="article"
      id={service.slug}
      className="grid scroll-mt-24 items-center gap-8 lg:grid-cols-2 lg:gap-16"
    >
      <Link
        href={href}
        className={cn(
          "group relative block aspect-[4/3] overflow-hidden rounded-3xl bg-brand-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue",
          flip ? "lg:order-2 clip-corner" : "clip-corner",
        )}
      >
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </Link>

      <div className="min-w-0">
        <Eyebrow>
          Service {String(index + 1).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")}
        </Eyebrow>
        <h3 className="mt-4 font-display text-2xl leading-tight font-normal tracking-[-0.02em] text-brand-black sm:text-3xl">
          <Link href={href} className="hover:text-brand-blue">
            {service.title}
          </Link>
        </h3>
        <p className="mt-4 leading-relaxed text-neutral-600">{service.description}</p>

        <ul className="mt-6 grid gap-x-6 gap-y-3 border-t border-neutral-200 pt-6 sm:grid-cols-2">
          {service.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-neutral-700">
              <Check className="mt-0.5 size-4 shrink-0 text-brand-blue" />
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href={href}
            className="group inline-flex items-center gap-2 rounded-md bg-brand-blue px-6 py-3 text-xs font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-brand-blue-dark"
          >
            View Details
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href={service.ctaHref}
            className="inline-flex items-center rounded-md border border-neutral-300 px-6 py-3 text-xs font-semibold tracking-[0.12em] text-brand-black uppercase transition-colors hover:border-brand-blue hover:text-brand-blue"
          >
            {service.cta}
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

export function ServiceCards() {
  return (
    <div className="flex flex-col gap-20 sm:gap-28">
      {SERVICES.map((service, index) => (
        <ServiceRow key={service.slug} service={service} index={index} />
      ))}
    </div>
  );
}
