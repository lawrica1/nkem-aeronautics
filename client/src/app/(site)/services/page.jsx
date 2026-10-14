import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServiceCards } from "@/components/ServiceCards";
import { ServicesOverview } from "@/components/ServicesOverview";
import { SectionHeading } from "@/components/SectionHeading";
import { CallToAction } from "@/components/CallToAction";
import { Reveal } from "@/components/Reveal";
import { PageHero, BTN_PRIMARY, BTN_SECONDARY } from "@/components/PageHero";

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
      <PageHero
        image="/images/hero/hero-crop-spray.jpg"
        eyebrow="What We Offer"
        title="Drone Services for Every Sector"
        intro="From precision agricultural spraying to wildlife surveillance and infrastructure inspection — Nkem Aeronautics delivers UAV solutions across Zambia and Africa."
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      >
        <Link href="/signup" className={BTN_PRIMARY}>
          Get Started
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link href="/contact" className={BTN_SECONDARY}>
          Contact Us
        </Link>
      </PageHero>

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
