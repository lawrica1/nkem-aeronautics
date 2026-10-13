import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, NotebookPen, Route } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { SERVICES } from "@/lib/services";
import { cn } from "@/lib/utils";

// Platform services that sit alongside the drone service lines (no detail page of their own).
const PLATFORM = [
  {
    icon: NotebookPen,
    title: "Farmer Registration & Logbook",
    description: "Digital sign-up with a unique ID and operation logbook for every farmer.",
    href: "/signup",
    action: "Register now",
  },
  {
    icon: Route,
    title: "Firm Routing & Distribution",
    description: "Service requests routed to affiliated firms for accurate resource allocation.",
    href: "/logbook",
    action: "Open your logbook",
  },
];

function ServiceTile({ service, index, featured, wide }) {
  const Icon = service.icon;
  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "group relative isolate flex min-h-72 flex-col justify-between gap-10 overflow-hidden rounded-2xl bg-brand-navy p-6 text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue sm:p-7",
        featured && "min-h-96",
        wide && "min-h-64 lg:min-h-72",
      )}
    >
      <Image
        src={(wide && service.banner) || service.image}
        alt=""
        fill
        sizes={wide ? "(max-width: 1200px) 100vw, 1152px" : featured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
        className="-z-20 object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-navy-dark via-brand-navy-dark/55 to-brand-navy-dark/5" />

      <div className="flex items-center justify-between">
        <span className="rounded-full bg-brand-navy-dark/50 px-2.5 py-1 font-mono text-xs tracking-widest text-white/85 backdrop-blur-sm">
          {String(index + 1).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")}
        </span>
        <span className="flex size-10 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-sm transition-colors group-hover:border-brand-blue group-hover:bg-brand-blue">
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      <div>
        <div className="flex size-10 items-center justify-center rounded-lg bg-brand-blue/90">
          <Icon className="size-5" />
        </div>
        <h3 className={cn("mt-4 font-semibold tracking-tight", featured ? "text-2xl sm:text-3xl" : "text-xl")}>
          {service.title}
        </h3>
        <p className={cn("mt-2 text-sm leading-relaxed text-white/75", featured ? "max-w-md sm:text-base" : wide ? "max-w-xl" : "line-clamp-3")}>
          {service.description}
        </p>
        {featured && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {service.features.map((f) => (
              <li key={f} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/85 backdrop-blur-sm">
                {f}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}

export function ServicesOverview() {
  const [first, ...rest] = SERVICES;
  return (
    <section id="catalog" className="bg-brand-paper px-6 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Our Services"
            title="What We Offer"
            intro="From aerial spraying to farmer data collection, every service works together to replace guesswork with real, regional data."
          />
          <Reveal>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:underline"
            >
              View all services
              <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid auto-rows-[minmax(18rem,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal className="flex flex-col sm:col-span-2 lg:row-span-2 [&>a]:flex-1">
            <ServiceTile service={first} index={0} featured />
          </Reveal>
          {rest.map((service, i) => {
            // With an odd tile left over, the last one spans the full row instead of sitting alone.
            const wide = rest.length % 2 === 1 && i === rest.length - 1;
            return (
              <Reveal
                key={service.slug}
                delay={(i + 1) * 80}
                className={cn("flex flex-col [&>a]:flex-1", wide && "sm:col-span-2 lg:col-span-4")}
              >
                <ServiceTile service={service} index={i + 1} wide={wide} />
              </Reveal>
            );
          })}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {PLATFORM.map(({ icon: Icon, title, description, href, action }, i) => (
            <Reveal key={title} delay={i * 100}>
              <Link
                href={href}
                className="group flex h-full flex-col gap-5 rounded-2xl border border-brand-line bg-white p-6 transition-colors hover:border-brand-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue sm:flex-row sm:items-center sm:p-7"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-gray-light text-brand-blue">
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold tracking-[0.16em] text-neutral-500 uppercase">Platform</p>
                  <h3 className="mt-1 font-semibold text-brand-ink">{title}</h3>
                  <p className="mt-1 text-sm text-neutral-600">{description}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap text-brand-blue">
                  {action}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
