import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SERVICES } from "@/lib/services";
import { cn } from "@/lib/utils";

function ServiceRow({ service, index }) {
  const Icon = service.icon;
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
          "group relative block aspect-[4/3] overflow-hidden rounded-3xl bg-brand-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue",
          flip && "lg:order-2",
        )}
      >
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-dark/50 via-transparent to-transparent" />
        <span className="absolute bottom-5 left-5 rounded-full bg-white/90 px-3 py-1 font-mono text-xs tracking-widest text-brand-ink backdrop-blur">
          {String(index + 1).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")}
        </span>
      </Link>

      <div className="min-w-0">
        <div className="flex size-11 items-center justify-center rounded-xl bg-brand-gray-light text-brand-blue">
          <Icon className="size-5" />
        </div>
        <h3 className="mt-5 text-2xl font-semibold tracking-tight text-brand-ink sm:text-3xl">
          <Link href={href} className="hover:text-brand-blue">
            {service.title}
          </Link>
        </h3>
        <p className="mt-4 leading-relaxed text-neutral-600">{service.description}</p>

        <ul className="mt-6 grid gap-x-6 gap-y-3 border-t border-brand-line pt-6 sm:grid-cols-2">
          {service.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-brand-ink/85">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-blue" />
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href={href}
            className="group inline-flex items-center gap-2 rounded-full bg-brand-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue"
          >
            View service details
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link href={service.ctaHref} className="text-sm font-semibold text-brand-blue hover:underline">
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
