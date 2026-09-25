import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { SERVICES } from "@/lib/services";

function ServiceCard({ service }) {
  const Icon = service.icon;
  const href = `/services/${service.slug}`;
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-shadow hover:shadow-md">
      <Link href={href} className="relative block h-48 w-full overflow-hidden bg-brand-navy">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover opacity-80"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 to-transparent" />
        <div className="absolute bottom-4 left-4 flex size-10 items-center justify-center rounded-xl bg-brand-blue/90">
          <Icon className="size-5 text-white" />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold text-brand-navy-dark">
          <Link href={href} className="hover:text-brand-blue">
            {service.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.description}</p>

        <ul className="mt-4 flex-1 space-y-2">
          {service.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-brand-navy-dark/80">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-blue" />
              {f}
            </li>
          ))}
        </ul>

        <Link
          href={href}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:underline"
        >
          View service details
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

export function ServiceCards() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {SERVICES.map((service) => (
        <ServiceCard key={service.slug} service={service} />
      ))}
    </div>
  );
}
