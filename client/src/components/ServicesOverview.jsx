import { Sprout, Binoculars, Building2, NotebookPen, Route } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const SERVICES = [
  {
    icon: Sprout,
    title: "Agricultural Spraying",
    description: "Precision UAV chemical spraying and crop monitoring for farms of any size.",
    image: "/images/services/agricultural-spraying.jpg",
  },
  {
    icon: Binoculars,
    title: "Wildlife & Surveillance",
    description: "Aerial monitoring drones for conservation, land security, and site oversight.",
    image: "/images/services/wildlife-surveillance.jpg",
  },
  {
    icon: Building2,
    title: "Real Estate Imaging",
    description: "Aerial photography for property and site documentation.",
    image: "/images/services/real-estate.jpg",
    comingSoon: true,
  },
  {
    icon: NotebookPen,
    title: "Farmer Registration & Logbook",
    description: "Digital sign-up with a unique ID and operation logbook for every farmer.",
  },
  {
    icon: Route,
    title: "Firm Routing & Distribution",
    description: "Service requests routed to affiliated firms for accurate resource allocation.",
  },
];

function ServiceCard({ icon: Icon, title, description, image, comingSoon }) {
  if (image) {
    return (
      <div className="group relative h-64 overflow-hidden rounded-lg">
        <img
          src={image}
          alt=""
          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-dark/90 via-brand-navy-dark/20 to-transparent" />
        {comingSoon && (
          <span className="absolute top-4 right-4 rounded-full bg-brand-gray-light px-2.5 py-1 text-xs font-medium text-neutral-700">
            Coming Soon
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-white/80">{description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full rounded-lg border border-border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex size-10 items-center justify-center rounded-md bg-brand-green/10">
        <Icon className="size-5 text-brand-green" />
      </div>
      <h3 className="mt-4 font-semibold text-brand-navy-dark">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function ServicesOverview() {
  return (
    <section className="flex min-h-screen flex-col justify-center border-t border-border bg-background px-6 py-24">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold tracking-widest text-brand-green uppercase">
            Our Services
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-brand-navy-dark sm:text-4xl">
            What We Offer
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From aerial spraying to farmer data collection, every service works together to
            replace guesswork with real, regional data.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => (
            <Reveal key={service.title} delay={index * 100}>
              <ServiceCard {...service} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
