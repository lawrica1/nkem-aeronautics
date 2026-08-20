import { MapPin, BarChart3, Layers, UserCheck } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const REASONS = [
  {
    icon: MapPin,
    title: "Regional Coverage",
    description: "Operating across Zambia and Sub-Saharan Africa.",
  },
  {
    icon: BarChart3,
    title: "Data-Driven Allocation",
    description: "Real farmer counts replace estimates for chemical distribution.",
  },
  {
    icon: Layers,
    title: "Dual-Sector Expertise",
    description: "Agricultural and wildlife & surveillance drone operations under one roof.",
  },
  {
    icon: UserCheck,
    title: "Farmer-First Design",
    description: "A simple sign-up flow built to work for every farmer, not just the tech-savvy.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="flex min-h-screen flex-col justify-center border-t border-border bg-background px-6 py-24">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold tracking-widest text-brand-green uppercase">
            Why Nkem Aeronautics
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-brand-navy-dark sm:text-4xl">
            Built for Real Farmers, Real Regions
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={index * 100}>
              <div className="flex size-10 items-center justify-center rounded-md bg-brand-green/10">
                <Icon className="size-5 text-brand-green" />
              </div>
              <h3 className="mt-4 font-semibold text-brand-navy-dark">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
