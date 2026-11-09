import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { SERVICES } from "@/lib/services";
import { cn } from "@/lib/utils";

// Column spans for the 4-column "fleet" grid: two rows of 1·2·1 and 1·1·2.
const SPANS = ["lg:col-span-1", "lg:col-span-2", "lg:col-span-1", "lg:col-span-1", "lg:col-span-1", "lg:col-span-2"];

function ServiceTile({ service, span, index }) {
  const wide = span === "lg:col-span-2";
  return (
    <Reveal delay={index * 70} className={cn("flex", span)}>
      <Link
        href={`/services/${service.slug}`}
        className="group relative isolate flex min-h-64 w-full flex-col justify-end overflow-hidden rounded-2xl bg-brand-black p-5 text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue sm:min-h-72 sm:p-6"
      >
        <Image
          src={(wide && service.banner) || service.image}
          alt=""
          fill
          sizes={wide ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
          className="-z-20 object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-black/90 via-brand-black/30 to-transparent" />
        <h3 className="font-display text-base font-normal tracking-tight sm:text-lg">{service.title}</h3>
        <p className={cn("mt-2 text-xs leading-relaxed text-white/75 sm:text-sm", wide ? "max-w-md" : "line-clamp-2")}>
          {service.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] text-white uppercase opacity-80 transition-opacity group-hover:opacity-100">
          Explore
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </Reveal>
  );
}

export function ServicesOverview() {
  return (
    <section id="services" className="scroll-mt-6 bg-white px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="The Nkem Difference" title="Discover Our Services" />
          <Reveal>
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 rounded-md bg-brand-blue px-6 py-3 text-xs font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-brand-blue-dark"
            >
              All Services
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, i) => (
            <ServiceTile key={service.slug} service={service} span={SPANS[i % SPANS.length]} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
