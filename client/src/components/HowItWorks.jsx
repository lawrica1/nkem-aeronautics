import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

const STEPS = [
  {
    number: "01",
    title: "Sign Up",
    description: "Register your details and declare your firm affiliation.",
  },
  {
    number: "02",
    title: "Get Your Logbook ID",
    description: "Receive a unique identification and logbook entry instantly.",
  },
  {
    number: "03",
    title: "Request a Service",
    description: "Request spraying drones, machinery, or another aerial service when you need it.",
  },
  {
    number: "04",
    title: "Routed & Fulfilled",
    description: "Your affiliated firm receives the request and supplies the service.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-brand-paper px-6 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow="How It Works" title="From Sign Up to Service, in Four Steps" />
          <Reveal>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-brand-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue"
            >
              Start step one
              <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <Reveal
              as="li"
              key={step.number}
              delay={index * 100}
              className="relative flex flex-col rounded-2xl border border-brand-line bg-white p-6"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-brand-blue font-mono text-xs font-semibold text-white">
                  {step.number}
                </span>
                {index < STEPS.length - 1 && <span aria-hidden="true" className="h-px flex-1 bg-brand-line" />}
              </div>
              <h3 className="mt-6 text-lg font-semibold text-brand-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{step.description}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
