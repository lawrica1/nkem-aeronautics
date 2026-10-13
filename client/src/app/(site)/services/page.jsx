import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServiceCards } from "@/components/ServiceCards";
import { SectionHeading } from "@/components/SectionHeading";
import { CallToAction } from "@/components/CallToAction";
import { Reveal } from "@/components/Reveal";
import { SERVICES } from "@/lib/services";

export const metadata = {
  title: "Services — Nkem Aeronautics",
  description:
    "Agricultural drone spraying, wildlife surveillance, pipeline inspection, and eVTOL services across Zambia and Africa.",
};

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

export default function ServicesPage() {
  return (
    <main className="flex-1">
      {/* Page hero */}
      <section className="relative isolate overflow-hidden bg-brand-navy-dark px-6 pt-20 pb-16 text-white sm:pt-28">
        <Image
          src="/images/hero/hero-crop-spray.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover opacity-45"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-navy-dark via-brand-navy-dark/85 to-brand-navy-dark/40" />
        <div className="mx-auto max-w-6xl">
          <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-brand-blue-light uppercase">
            <span className="h-px w-8 bg-brand-blue-light" />
            What We Offer
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl leading-[1.05] font-semibold tracking-[-0.025em] text-balance sm:text-6xl">
            Drone Services for <span className="text-white/55">Every Sector</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
            From precision agricultural spraying to wildlife surveillance and infrastructure
            inspection — Nkem Aeronautics delivers UAV solutions across Zambia and Africa.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-full bg-brand-blue px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-dark"
            >
              Get Started
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>

          {/* Jump list to each service row below */}
          <nav aria-label="Services on this page" className="mt-14 border-t border-white/15 pt-6">
            <ul className="flex flex-wrap gap-2">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <a
                    href={`#${s.slug}`}
                    className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/85 backdrop-blur-sm transition-colors hover:border-white/50 hover:text-white"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <ServiceCards />
        </div>
      </section>

      {/* How it works */}
      <section className="bg-brand-paper px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Simple Process" title="How It Works" />
          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {HOW_IT_WORKS.map((step, i) => (
              <Reveal
                as="li"
                key={step.step}
                delay={i * 100}
                className="flex flex-col rounded-2xl border border-brand-line bg-white p-7"
              >
                <span className="font-mono text-4xl font-medium text-brand-blue">{step.step}</span>
                <h3 className="mt-6 text-lg font-semibold text-brand-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{step.description}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <CallToAction title="Ready to get started?" />
    </main>
  );
}
