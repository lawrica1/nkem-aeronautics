import Image from "next/image";
import Link from "next/link";
import {
  Sprout,
  Binoculars,
  Ruler,
  Workflow,
  Zap,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

export const metadata = {
  title: "Services — Nkem Aeronautics",
  description:
    "Agricultural drone spraying, wildlife surveillance, pipeline inspection, and eVTOL services across Zambia and Africa.",
};

const SERVICES = [
  {
    slug: "agricultural",
    icon: Sprout,
    title: "Agricultural Drone Services",
    description:
      "Precision UAV operations for farmers and agricultural firms — from crop spraying to health assessments and farm mapping.",
    image: "/images/services/agricultural-spraying.jpg",
    features: [
      "Crop spraying & pesticide application",
      "Farm monitoring & surveillance",
      "Crop health & yield assessment",
      "Farm mapping & boundary survey",
    ],
    cta: "Register as a Farmer",
    ctaHref: "/signup",
    primary: true,
  },
  {
    slug: "wildlife",
    icon: Binoculars,
    title: "Wildlife & Surveillance",
    description:
      "Autonomous aerial surveillance for conservation, anti-poaching, and area monitoring — capturing high-resolution footage across large landscapes.",
    image: "/images/services/wildlife-surveillance.jpg",
    features: [
      "Wildlife monitoring & tracking",
      "Anti-poaching patrol operations",
      "GPS tracking & geo-fencing",
      "High-resolution photo & video capture",
    ],
    cta: "Get in Touch",
    ctaHref: "/contact",
    primary: false,
  },
  {
    slug: "pipeline",
    icon: Workflow,
    title: "Pipeline & Infrastructure Inspection",
    description:
      "Rapid, cost-effective drone inspections of oil, gas, and water pipelines — reducing downtime and manual risk for operators.",
    image: "/images/services/pipeline-infrastructure.jpg",
    features: [
      "Pipeline leak detection",
      "Infrastructure condition assessment",
      "Remote site inspection",
      "Detailed inspection reporting",
    ],
    cta: "Get in Touch",
    ctaHref: "/contact",
    primary: false,
  },
  {
    slug: "survey-mapping",
    icon: Ruler,
    title: "Aerial & Survey Mapping",
    description:
      "High-accuracy topographic surveys, volumetric measurements, and digital elevation models for engineering and government projects.",
    image: "/images/services/survey-mapping.jpg",
    features: [
      "Topographic & cadastral surveys",
      "Volumetric & stockpile measurement",
      "Digital elevation models (DEM)",
      "GIS-ready deliverables",
    ],
    cta: "Get in Touch",
    ctaHref: "/contact",
    primary: false,
  },
  {
    slug: "evtol",
    icon: Zap,
    title: "eVTOL & Heavy-Lift Operations",
    description:
      "Specialised heavy-lift VTOL fixed-wing drone missions for cargo, emergency supply, and large-scale field operations.",
    image: "/images/services/evtol-heavy-lift.jpg",
    features: [
      "Heavy-lift payload delivery",
      "Emergency supply drops",
      "Large-area field coverage",
      "Long-range autonomous missions",
    ],
    cta: "Get in Touch",
    ctaHref: "/contact",
    primary: false,
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Create Your Account",
    description:
      "Register on the Nkem platform, select your sector, and verify your account via SMS to receive your unique ID.",
  },
  {
    step: "02",
    title: "Submit a Service Request",
    description:
      "Log in to your portal, choose the service you need, describe your requirements, and submit. Our team receives it immediately.",
  },
  {
    step: "03",
    title: "We Coordinate & Deliver",
    description:
      "Nkem Aeronautics assigns the right drone and pilot, carries out the operation, and records the full results in your portal.",
  },
];

function ServiceCard({ service }) {
  const Icon = service.icon;
  return (
    <div
      id={service.slug}
      className="flex scroll-mt-24 flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-shadow hover:shadow-md"
    >
      {service.image ? (
        <div className="relative h-48 w-full overflow-hidden bg-brand-navy">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover opacity-80"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 to-transparent" />
          <div className="absolute bottom-4 left-4 flex size-10 items-center justify-center rounded-xl bg-brand-blue/90">
            <Icon className="size-5 text-white" />
          </div>
        </div>
      ) : (
        <div className="flex h-28 items-center justify-center bg-brand-gray-light">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-blue/10">
            <Icon className="size-7 text-brand-blue" />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold text-brand-navy-dark">{service.title}</h3>
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
          href={service.ctaHref}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:underline"
        >
          {service.cta}
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <main className="flex-1">
      {/* Page hero */}
      <section className="bg-brand-navy px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-xs font-semibold tracking-widest text-white/60 uppercase">
            What We Offer
          </p>
          <h1 className="text-4xl font-bold sm:text-5xl">
            Drone Services for{" "}
            <span className="text-white">Every Sector</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
            From precision agricultural spraying to wildlife surveillance and infrastructure
            inspection — Nkem Aeronautics delivers UAV solutions across Zambia and Africa.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-8 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-brand-blue-dark"
            >
              Get Started
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-brand-gray-light px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold tracking-widest text-brand-blue uppercase">
              Simple Process
            </p>
            <h2 className="mt-2 text-3xl font-bold text-brand-navy-dark">How It Works</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-brand-blue text-xl font-bold text-white">
                  {step.step}
                </div>
                <h3 className="font-semibold text-brand-navy-dark">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-navy px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="mt-4 text-white/70">
            Register your account today and start requesting drone services through your personal
            portal.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-blue px-10 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-brand-blue-dark"
          >
            Create Your Account
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
