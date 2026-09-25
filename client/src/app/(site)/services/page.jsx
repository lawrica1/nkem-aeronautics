import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServiceCards } from "@/components/ServiceCards";

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
          <ServiceCards />
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
