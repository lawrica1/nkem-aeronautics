import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServiceCards } from "@/components/ServiceCards";
import { ServicesOverview } from "@/components/ServicesOverview";
import { SectionHeading } from "@/components/SectionHeading";
import { CallToAction } from "@/components/CallToAction";
import { Reveal } from "@/components/Reveal";

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
      <section className="bg-white px-4 pt-6 sm:px-6 sm:pt-8">
        <div className="clip-notch relative isolate mx-auto flex min-h-[26rem] max-w-6xl items-center overflow-hidden rounded-3xl bg-brand-black px-6 py-24 text-white sm:px-14">
          <Image
            src="/images/hero/hero-crop-spray.jpg"
            alt=""
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1152px"
            className="-z-20 object-cover opacity-60"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-black/95 via-brand-black/70 to-brand-black/20" />
          <div className="grid w-full gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-white/70 uppercase">
                <span aria-hidden="true" className="font-display tracking-[-0.1em] text-brand-blue-light">
                  &rsaquo;&rsaquo;&rsaquo;
                </span>
                What We Offer
              </p>
              <h1 className="mt-5 font-display text-4xl leading-[1.1] font-light tracking-[-0.02em] text-balance sm:text-6xl">
                Drone Services for Every Sector
              </h1>
            </div>
            <div className="flex flex-col gap-6">
              <p className="text-sm leading-relaxed text-white/80 sm:text-base">
                From precision agricultural spraying to wildlife surveillance and infrastructure
                inspection — Nkem Aeronautics delivers UAV solutions across Zambia and Africa.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="group inline-flex items-center gap-2 rounded-md bg-brand-blue px-6 py-3 text-xs font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-brand-blue-dark"
                >
                  Get Started
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3 text-xs font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-white/10"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServicesOverview />

      {/* One row per service */}
      <section className="bg-brand-paper px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <ServiceCards />
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Simple Process" title="How It Works" align="center" />
          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {HOW_IT_WORKS.map((step, i) => (
              <Reveal
                as="li"
                key={step.step}
                delay={i * 100}
                className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-7"
              >
                <span className="font-display text-3xl font-light text-brand-blue">{step.step}</span>
                <h3 className="mt-6 font-display text-base font-normal tracking-tight text-brand-black">{step.title}</h3>
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
