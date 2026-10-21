import Image from "next/image";
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
    <section id="logbook" className="scroll-mt-6 bg-white px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Farmer Registration & Logbook"
            title="From Sign Up to Service, in Four Steps"
            intro="Digital sign-up with a unique ID and operation logbook for every farmer, with service requests routed to affiliated firms for accurate resource allocation."
          />
          <ol className="mt-8 grid gap-x-6 gap-y-6 sm:grid-cols-2">
            {STEPS.map((step, index) => (
              <Reveal as="li" key={step.number} delay={index * 90} className="border-t border-neutral-200 pt-4">
                <p className="font-display text-xs text-brand-blue">{step.number}</p>
                <h3 className="mt-2 font-display text-sm font-normal tracking-tight text-brand-black">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{step.description}</p>
              </Reveal>
            ))}
          </ol>
          <Reveal className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-md bg-brand-blue px-6 py-3 text-xs font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-brand-blue-dark"
            >
              Register Now
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/logbook"
              className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-6 py-3 text-xs font-semibold tracking-[0.12em] text-brand-black uppercase transition-colors hover:border-brand-blue hover:text-brand-blue"
            >
              Open Logbook Portal
            </Link>
          </Reveal>
        </div>

        <Reveal delay={120} className="clip-corner relative aspect-[4/3.4] overflow-hidden rounded-3xl bg-brand-black lg:aspect-[4/4.2]">
          <Image
            src="/images/applications/agriculture-monitoring.jpg"
            alt="Rows of young crops in a farm field"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-x-5 bottom-5 flex items-center justify-between rounded-xl bg-white/90 px-4 py-3 backdrop-blur sm:inset-x-auto sm:right-5 sm:w-64">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.14em] text-neutral-500 uppercase">Logbook ID</p>
              <p className="mt-0.5 font-display text-sm text-brand-black">Issued on sign-up</p>
            </div>
            <span className="rounded bg-brand-blue px-2 py-1 text-[10px] font-semibold tracking-wider text-white uppercase">
              SMS verified
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
